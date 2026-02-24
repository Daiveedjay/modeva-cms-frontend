"use client";

import React, { useMemo, useState } from "react";
import { useCustomerModalStore } from "@/lib/store/customers/use-customer-modal-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail } from "lucide-react";
import { useGetCustomerById } from "@/app/_queries/customers/get-customer-by-id";
import { useSendCustomerEmail } from "@/app/_queries/customers/send-customer-email";
import { toastSuccess } from "@/lib/utils";

interface SendEmailInput {
  subject: string;
  message: string;
}

export function SendCustomerEmailModal() {
  const customerModal = useCustomerModalStore((s) => s.customerModal);
  const closeCustomerModal = useCustomerModalStore((s) => s.closeCustomerModal);

  const open =
    customerModal?.type === "send-customer-email" &&
    !!customerModal?.customer_id;

  const customerId = customerModal?.customer_id || "";

  const { data, isLoading, error } = useGetCustomerById(customerId, {
    enabled: open && !!customerId,
  });

  const customer = data?.data;

  const { mutateAsync: sendCustomerEmail, isPending } =
    useSendCustomerEmail(customerId);

  const [formChanges, setFormChanges] = useState<Partial<SendEmailInput>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const formData = useMemo<SendEmailInput>(() => {
    return {
      subject: formChanges.subject ?? "",
      message: formChanges.message ?? "",
    };
  }, [formChanges]);

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;

  // Show error dialog if customer fetch failed
  if (error || !customer) {
    return (
      <Dialog
        open={open}
        onOpenChange={(next) => !next && closeCustomerModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Failed to load customer</DialogTitle>
            <DialogDescription>
              {error?.message ||
                "Could not load customer details. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={closeCustomerModal}
            variant="outline"
            className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormChanges((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const handleSubmit = async () => {
    setValidationError(null);

    if (!formData.subject.trim()) {
      setValidationError("Subject is required");
      return;
    }
    if (!formData.message.trim()) {
      setValidationError("Message is required");
      return;
    }

    try {
      await sendCustomerEmail(formData);

      toastSuccess("Email sent successfully");
      handleClose();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const handleClose = () => {
    setFormChanges({});
    setValidationError(null);
    closeCustomerModal();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isPending) handleClose();
      }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            Send Email
          </DialogTitle>
          <DialogDescription className="block text-sm font-medium mb-1">
            Send an email to{" "}
            <span className="font-medium text-foreground">{customer.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {validationError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {validationError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="to" className="block text-sm font-medium mb-1">
              To
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="to"
                name="to"
                type="email"
                value={customer.email}
                onChange={handleInputChange}
                disabled
                className="flex-1 h-11 bg-muted/30"
              />
              <Badge variant="secondary" className="shrink-0">
                {customer.name}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Email subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={isPending}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={handleInputChange}
              disabled={isPending}
              className="min-h-48 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.message.length} characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 h-11">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 h-11 bg-primary">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
