"use client";

import { useMemo, useState } from "react";
import { useGetOrderById } from "@/app/_queries/orders/get-order-by-id";
import { getStatusIcon } from "@/components/reuseables/get-status-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useOrderModalStore } from "@/lib/store/orders/use-orders-modals-store";

import { CheckCircle, Clock, Package, Truck, X } from "lucide-react";
import React from "react";
import { useUpdateOrderStatus } from "@/app/_queries/orders/update-order-status";
import { Spinner } from "@/components/reuseables/spinner";
import { OrderStatus } from "@/lib/types/order";
import { toastSuccess } from "@/lib/utils";

export function UpdateOrderStatusModal() {
  const orderModal = useOrderModalStore((s) => s.orderModal);
  const closeOrderModal = useOrderModalStore((s) => s.closeOrderModal);

  const open =
    !!orderModal?.orderId && orderModal.type === "update-order-status";
  const orderId = orderModal?.orderId ?? "";

  const { data, isLoading, isError } = useGetOrderById(orderId, {
    enabled: open && !!orderId,
  });

  const order = data?.data;

  const loadedStatus = useMemo(
    () => order?.status || "pending",
    [order?.status],
  );

  const [editedStatus, setEditedStatus] = useState<OrderStatus | null>(null);
  const [notes, setNotes] = useState("");

  const newStatus = editedStatus ?? loadedStatus;

  const { mutateAsync: updateOrderStatus, isPending } =
    useUpdateOrderStatus(orderId);

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;

  // Show error dialog if order fetch failed
  if (isError || !order) {
    return (
      <Dialog open={open} onOpenChange={closeOrderModal}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Failed to load order</DialogTitle>
            <DialogDescription>
              Could not load order details. Please try again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeOrderModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const statusOptions: { value: OrderStatus; icon: React.ReactNode }[] = [
    { value: "pending", icon: <Package className="h-4 w-4" /> },
    { value: "processing", icon: <Clock className="h-4 w-4" /> },
    { value: "shipped", icon: <Truck className="h-4 w-4" /> },
    { value: "completed", icon: <CheckCircle className="h-4 w-4" /> },
    { value: "cancelled", icon: <X className="h-4 w-4" /> },
  ];

  const changed =
    newStatus !== order.status || notes.trim() !== (order.customer_notes ?? "");

  const handleSubmit = async () => {
    if (!changed) return;

    try {
      await updateOrderStatus({
        status: newStatus,
        admin_notes: notes.trim() || undefined,
      });

      toastSuccess(`Order status updated to ${newStatus}`);
      setEditedStatus(null);
      setNotes("");
      closeOrderModal();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const handleClose = () => {
    setEditedStatus(null);
    setNotes("");
    closeOrderModal();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isPending) handleClose();
      }}>
      <DialogContent className="sm:max-w-125">
        <Header
          order={{
            order_number: order.order_number,
            customer_name: order.customer_name,
          }}
          newStatus={newStatus}
        />

        <div className="space-y-4">
          <CurrentStatus
            order={{ order_number: order.order_number, status: order.status }}
          />

          <StatusSelect
            newStatus={newStatus}
            options={statusOptions}
            onChange={(status) => setEditedStatus(status)}
            disabled={isPending}
          />

          <NotesField
            value={notes}
            onChange={setNotes}
            placeholder={order.customer_notes || "Add any notes..."}
            disabled={isPending}
          />

          <StatusPreview
            order={{ status: order.status }}
            newStatus={newStatus}
          />
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!changed || isPending}>
            {isPending && <Spinner />}
            {isPending ? "Updating status..." : "Update status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Header({
  order,
  newStatus,
}: {
  order: { order_number: string; customer_name: string };
  newStatus: OrderStatus;
}) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        {getStatusIcon(newStatus)}
        Update order #{order.order_number}
      </DialogTitle>
      <DialogDescription>
        Changing status for {order.customer_name}
      </DialogDescription>
    </DialogHeader>
  );
}

function CurrentStatus({
  order,
}: {
  order: { order_number: string; status: OrderStatus };
}) {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Current status</p>
          <p className="text-sm text-muted-foreground">
            Order {order.order_number}
          </p>
        </div>
        <div className="flex items-center gap-2 capitalize text-sm">
          {getStatusIcon(order.status)}
          {order.status}
        </div>
      </div>
    </div>
  );
}

function StatusSelect({
  newStatus,
  options,
  onChange,
  disabled,
}: {
  newStatus: OrderStatus;
  options: { value: OrderStatus; icon: React.ReactNode }[];
  onChange: (s: OrderStatus) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="new-status">New status</Label>
      <Select
        value={newStatus}
        onValueChange={(v) => onChange(v as OrderStatus)}
        disabled={disabled}>
        <SelectTrigger id="new-status">
          <SelectValue placeholder="Select new status" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <div className="flex items-center capitalize gap-2">
                {opt.icon}
                {opt.value}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function NotesField({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status-notes">Notes (optional)</Label>
      <Textarea
        id="status-notes"
        rows={3}
        placeholder={placeholder || "Add any notes..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

function StatusPreview({
  order,
  newStatus,
}: {
  order: { status: OrderStatus };
  newStatus: OrderStatus;
}) {
  if (newStatus === order.status) return null;
  return (
    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
        Preview
      </p>
      <div className="flex items-center capitalize gap-2 mt-2 text-sm">
        <span className="flex items-center gap-1">
          {getStatusIcon(order.status)} {order.status}
        </span>
        <span>→</span>
        <span className="flex items-center gap-1">
          {getStatusIcon(newStatus)} {newStatus}
        </span>
      </div>
    </div>
  );
}
