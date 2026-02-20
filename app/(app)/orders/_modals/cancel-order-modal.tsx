"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useOrderModalStore } from "@/lib/store/orders/use-orders-modals-store";
import RequiredTag from "@/components/reuseables/required-tag";

import { useGetOrderById } from "@/app/_queries/orders/get-order-by-id";
import { useUpdateOrderStatus } from "@/app/_queries/orders/update-order-status";
import { Spinner } from "@/components/reuseables/spinner";
import { OrderDetails } from "@/lib/types/order";
import { toastSuccess } from "@/lib/utils";

export function CancelOrderModal() {
  const orderModal = useOrderModalStore((s) => s.orderModal);
  const closeOrderModal = useOrderModalStore((s) => s.closeOrderModal);

  const open =
    !!orderModal?.orderId && orderModal.type === "cancel-customer-order";
  const orderId = orderModal?.orderId ?? "";

  const { data, isLoading, isError, error } = useGetOrderById(orderId, {
    enabled: open,
  });

  const order = data?.data;

  const { mutateAsync: updateOrderStatus, isPending } = useUpdateOrderStatus(
    order?.id || orderId,
  );

  const [reason, setReason] = useState("");
  // TODO: These checkbox values are not yet sent to the API
  // Will be implemented in future update
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [processRefund, setProcessRefund] = useState(true);

  const canRefund = useMemo(() => {
    return order?.status !== "pending" && order?.status !== "cancelled";
  }, [order?.status]);

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;

  // Show error dialog if order fetch failed
  if (isError) {
    return (
      <AlertDialog
        open={open}
        onOpenChange={(next) => !next && closeOrderModal()}>
        <AlertDialogContent className="sm:max-w-125">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Failed to load order
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error?.message ||
                "Could not load order details. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeOrderModal}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (!order) return null;

  const disabled = !reason.trim();

  const handleConfirmCancel = async () => {
    if (disabled) return;

    try {
      await updateOrderStatus({ status: "cancelled", admin_notes: reason });

      toastSuccess("Order cancelled successfully");
      closeOrderModal();
      setReason("");
      setNotifyCustomer(true);
      setProcessRefund(true);
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const handleClose = (nextOpen: boolean) => {
    if (isPending) return; // Prevent closing during cancellation

    if (!nextOpen) {
      closeOrderModal();
      setReason("");
      setNotifyCustomer(true);
      setProcessRefund(true);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-125">
        <HeaderSection />
        <BodySection
          order={order}
          reason={reason}
          onReasonChange={setReason}
          canRefund={canRefund}
          processRefund={processRefund}
          onProcessRefundChange={(v) => setProcessRefund(Boolean(v))}
          notifyCustomer={notifyCustomer}
          onNotifyCustomerChange={(v) => setNotifyCustomer(Boolean(v))}
          disabled={isPending}
        />
        <ActionsSection
          isPending={isPending}
          onCancel={() => handleClose(false)}
          onConfirm={handleConfirmCancel}
          disabled={disabled}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function HeaderSection() {
  return (
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        Cancel order
      </AlertDialogTitle>
      <AlertDialogDescription>
        You are about to cancel this order. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
  );
}

interface BodySectionProps {
  order: OrderDetails;
  reason: string;
  onReasonChange: (val: string) => void;
  canRefund: boolean;
  processRefund: boolean;
  onProcessRefundChange: (val: boolean) => void;
  notifyCustomer: boolean;
  onNotifyCustomerChange: (val: boolean) => void;
  disabled: boolean;
}

function BodySection({
  order,
  reason,
  onReasonChange,
  canRefund,
  processRefund,
  onProcessRefundChange,
  notifyCustomer,
  onNotifyCustomerChange,
  disabled,
}: BodySectionProps) {
  return (
    <div className="space-y-4">
      <OrderSummary order={order} />
      <CancellationReason
        reason={reason}
        onChange={onReasonChange}
        disabled={disabled}
      />
      {canRefund && (
        <RefundOption
          total={order.total_amount}
          checked={processRefund}
          onChange={onProcessRefundChange}
          disabled={disabled}
        />
      )}
      <NotificationOption
        email={order.customer_email}
        checked={notifyCustomer}
        onChange={onNotifyCustomerChange}
        disabled={disabled}
      />
      <WarningMessage />
    </div>
  );
}

function OrderSummary({ order }: { order: OrderDetails }) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <span className="font-medium text-red-900 dark:text-red-100">
          Order to be cancelled
        </span>
      </div>
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Order number:</span>{" "}
          {order.order_number}
        </p>
        <p>
          <span className="font-medium">Order ID:</span> {order.id}
        </p>
        <p>
          <span className="font-medium">Customer:</span> {order.customer_name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {order.customer_email}
        </p>
        <p>
          <span className="font-medium">Total:</span> $
          {Number(order.total_amount ?? 0).toFixed(2)}
        </p>
        <p className="capitalize">
          <span className="font-medium">Status:</span> {order.status}
        </p>
      </div>
    </div>
  );
}

function CancellationReason({
  reason,
  onChange,
  disabled,
}: {
  reason: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="cancel-reason">
        Reason for cancellation <RequiredTag />
      </Label>
      <Textarea
        id="cancel-reason"
        placeholder="Please provide a reason for cancelling this order..."
        value={reason}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-none wrap-break-word overflow-hidden"
        disabled={disabled}
      />
    </div>
  );
}

function RefundOption({
  total,
  checked,
  onChange,
  disabled,
}: {
  total: number | string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="process-refund"
          checked={checked}
          onCheckedChange={(c) => onChange(c === true)}
          disabled={disabled}
        />
        <Label htmlFor="process-refund" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Process full refund (${Number(total ?? 0).toFixed(2)})
        </Label>
      </div>
      {checked && (
        <p className="text-sm text-muted-foreground ml-6">
          A full refund will be processed to the customer&apos;s original
          payment method.
        </p>
      )}
    </div>
  );
}

function NotificationOption({
  email,
  checked,
  onChange,
  disabled,
}: {
  email: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="notify-customer"
          checked={checked}
          onCheckedChange={(c) => onChange(c === true)}
          disabled={disabled}
        />
        <Label htmlFor="notify-customer">
          Send cancellation notification to customer
        </Label>
      </div>
      {checked && (
        <p className="text-sm text-muted-foreground ml-6">
          An email will be sent to {email} notifying them of the cancellation.
        </p>
      )}
    </div>
  );
}

function WarningMessage() {
  return (
    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        <span className="font-medium">Warning:</span> This action cannot be
        undone. The order will be permanently cancelled and removed from active
        orders.
      </p>
    </div>
  );
}

function ActionsSection({
  onCancel,
  onConfirm,
  isPending,
  disabled,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  disabled: boolean;
  isPending: boolean;
}) {
  return (
    <AlertDialogFooter>
      <AlertDialogCancel onClick={onCancel} disabled={isPending}>
        Keep order
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={onConfirm}
        disabled={disabled || isPending}
        className="bg-destructive text-foreground hover:bg-destructive/70">
        {isPending && <Spinner />}
        {isPending ? "Cancelling order..." : "Cancel order"}
      </AlertDialogAction>
    </AlertDialogFooter>
  );
}
