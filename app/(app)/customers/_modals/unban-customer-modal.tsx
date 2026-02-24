import { useGetCustomerById } from "@/app/_queries/customers/get-customer-by-id";

import { useCustomerModalStore } from "@/lib/store/customers/use-customer-modal-store";
import { BaseCustomerActionModal } from "@/app/(app)/customers/_modals/base-customer-action-modal";
import { toastSuccess } from "@/lib/utils";
import { useUnbanCustomer } from "@/app/_queries/customers/unban-customer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
export function UnbanCustomerModal() {
  const { customerModal, closeCustomerModal } = useCustomerModalStore();

  const open =
    customerModal?.type === "unban-customer" && !!customerModal?.customer_id;

  const customerId = customerModal?.customer_id || "";

  const { data, isLoading, error } = useGetCustomerById(customerId, {
    enabled: open,
  });

  const customer = data?.data;
  const { mutateAsync: unbanCustomer, isPending } =
    useUnbanCustomer(customerId);

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;

  // Show error modal if customer fetch failed
  if (error || !customer) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && closeCustomerModal()}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Failed to load customer</DialogTitle>
            <DialogDescription>
              {error?.message ||
                "Could not load customer details. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
          <Button onClick={closeCustomerModal} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const handleConfirm = async (reason: string) => {
    await unbanCustomer({ reason });

    toastSuccess("Customer unbanned successfully");
    closeCustomerModal();
  };

  return (
    <BaseCustomerActionModal
      open={open}
      title="Unban customer"
      description={
        <>
          Unban{" "}
          <span className="font-bold text-white text-sm">{customer.name}</span>.
          This will restore access to the customer&apos;s account.
        </>
      }
      confirmText="Unban customer"
      warningText={
        <>
          I understand this will <strong>restore access</strong> to the
          customer.
        </>
      }
      customer={customer}
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
