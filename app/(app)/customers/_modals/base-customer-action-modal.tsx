"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
import { CustomerDetail } from "@/lib/types/customer";
import { useCustomerModalStore } from "@/lib/store/customers/use-customer-modal-store";

interface BaseActionModalProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmText: string;
  warningText: React.ReactNode;
  customer: CustomerDetail;
  isPending: boolean;
  onConfirm: (reason: string) => Promise<void>;
}

export function BaseCustomerActionModal({
  open,
  title,
  description,
  confirmText,
  warningText,
  customer,
  isPending,
  onConfirm,
}: BaseActionModalProps) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeCustomerModal = useCustomerModalStore(
    (store) => store.closeCustomerModal,
  );

  const handleSubmit = async () => {
    setError(null);

    if (!reason.trim()) {
      setError("A reason is required");
      return;
    }

    if (!confirmed) {
      setError("Please confirm this action");
      return;
    }

    try {
      await onConfirm(reason);

      // Reset state on success
      setReason("");
      setConfirmed(false);
      setError(null);
    } catch {
      // Error already handled by parent component/API
      // Keep modal open so user can retry
    }
  };

  const handleClose = () => {
    setReason("");
    setConfirmed(false);
    setError(null);
    closeCustomerModal();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isPending) handleClose();
      }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Customer</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{customer.name}</span>
              <Badge variant="secondary">{customer.email}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground">
              Reason *
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isPending}
              className="min-h-32 resize-none"
            />
          </div>

          <div className="border rounded-lg p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <Checkbox
                id="confirm"
                checked={confirmed}
                onCheckedChange={(v) => setConfirmed(!!v)}
                disabled={isPending}
                className="mt-1"
              />
              <Label
                className="text-sm leading-tight cursor-pointer"
                htmlFor="confirm">
                <span>{warningText}</span>
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 h-11">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isPending || !confirmed}
              className="flex-1 h-11">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
