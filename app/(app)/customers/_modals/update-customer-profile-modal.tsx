"use client";

import { useGetCustomerById } from "@/app/_queries/customers/get-customer-by-id";
import { useUpdateCustomerDetails } from "@/app/_queries/customers/update-customer-details";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerModalStore } from "@/lib/store/customers/use-customer-modal-store";
import { CustomerStatus, UpdateCustomerInput } from "@/lib/types/customer";
import { toastSuccess } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { AlertTriangle, Calendar as CalendarIcon } from "lucide-react";
import React, { useState } from "react";

interface UpdateCustomerProfileModalProps {
  customerId?: string;
  customerName?: string;
  onSuccess?: () => void;
}

export function UpdateCustomerProfileModal({
  customerId,
  customerName,
  onSuccess,
}: UpdateCustomerProfileModalProps) {
  const customerModal = useCustomerModalStore((s) => s.customerModal);
  const closeCustomerModal = useCustomerModalStore((s) => s.closeCustomerModal);

  const open =
    customerModal?.type === "update-customer-profile" &&
    !!customerModal?.customer_id;

  const id = customerModal?.customer_id || customerId;

  const { data: customerResponse, isLoading } = useGetCustomerById(id || "", {
    enabled: open,
  });

  const customer = customerResponse?.data;

  const { mutateAsync: updateCustomerDetails, isPending } =
    useUpdateCustomerDetails(id || "");

  const [formChanges, setFormChanges] = useState<UpdateCustomerInput>({});
  const [error, setError] = useState<string | null>(null);
  const [suspensionDate, setSuspensionDate] = useState<Date | null>(null);

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;
  if (!customer) return null;

  const formData = {
    name: formChanges.name ?? customer.name,
    phone: formChanges.phone ?? customer.phone,
    status: formChanges.status ?? (customer.status as CustomerStatus),
    ban_reason: formChanges.ban_reason ?? customer.ban_reason ?? undefined,
    suspended_until:
      formChanges.suspended_until ??
      (customer.suspended_until
        ? customer.suspended_until.toString()
        : undefined),
    suspended_reason:
      formChanges.suspended_reason ?? customer.suspended_reason ?? undefined,
  };

  const showSuspensionFields = formData.status === "suspended";
  const showBanFields = formData.status === "banned";

  const effectiveSuspensionDate =
    suspensionDate ||
    (customer?.suspended_until ? new Date(customer.suspended_until) : null);

  const handleStatusChange = (value: CustomerStatus) => {
    setFormChanges((prev) => ({ ...prev, status: value }));
    setError(null);
  };

  const handleSuspensionDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setSuspensionDate(date);
    setFormChanges((prev) => ({
      ...prev,
      suspended_until: date.toISOString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.status === "suspended") {
      if (!formData.suspended_until) {
        setError("Suspension end date is required");
        return;
      }
      if (!formData.suspended_reason?.trim()) {
        setError("Suspension reason is required");
        return;
      }
    }

    if (formData.status === "banned") {
      if (!formData.ban_reason?.trim()) {
        setError("Ban reason is required");
        return;
      }
    }

    if (Object.keys(formChanges).length === 0) {
      setError("Please make changes before updating");
      return;
    }

    try {
      await updateCustomerDetails(formChanges);

      toastSuccess("Customer updated successfully");
      handleClose();
      onSuccess?.();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const handleClose = () => {
    setFormChanges({});
    setSuspensionDate(null);
    setError(null);
    closeCustomerModal();
  };

  const displayName = customer.name || customerName || "Customer";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isPending) handleClose();
      }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Customer Profile</DialogTitle>
          <DialogDescription>
            Update details for {displayName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormChanges((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormChanges((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || ""}
              onValueChange={handleStatusChange}
              disabled={isPending}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showSuspensionFields && (
            <>
              <div className="space-y-2">
                <Label>Suspended Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      disabled={isPending}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {effectiveSuspensionDate
                        ? format(effectiveSuspensionDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={effectiveSuspensionDate || undefined}
                      onSelect={handleSuspensionDateSelect}
                      disabled={(date) => date < new Date()}
                      defaultMonth={addDays(new Date(), 7)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suspension-reason">Suspension Reason</Label>
                <Textarea
                  id="suspension-reason"
                  value={formData.suspended_reason || ""}
                  onChange={(e) =>
                    setFormChanges((prev) => ({
                      ...prev,
                      suspended_reason: e.target.value,
                    }))
                  }
                  rows={3}
                  disabled={isPending}
                />
              </div>
            </>
          )}

          {showBanFields && (
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Ban Reason</Label>
              <Textarea
                id="ban-reason"
                value={formData.ban_reason || ""}
                onChange={(e) =>
                  setFormChanges((prev) => ({
                    ...prev,
                    ban_reason: e.target.value,
                  }))
                }
                rows={3}
                disabled={isPending}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1">
              {isPending ? "Updating..." : "Update Customer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
