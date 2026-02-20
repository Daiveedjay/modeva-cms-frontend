import { useGetCustomerById } from "@/app/_queries/customers/get-customer-by-id";

import { useCustomerModalStore } from "@/lib/store/customers/use-customer-modal-store";
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
import { BaseCustomerActionModal } from "@/app/(app)/customers/_modals/base-customer-action-modal";
import { useDeleteCustomer } from "@/app/_queries/customers/delete-customer";
import { toastSuccess } from "@/lib/utils";

export function DeleteCustomerModal() {
  const { customerModal, closeCustomerModal } = useCustomerModalStore();

  const open =
    customerModal?.type === "delete-customer" && !!customerModal?.customer_id;

  const customerId = customerModal?.customer_id || "";

  const { data, isLoading, error } = useGetCustomerById(customerId, {
    enabled: open,
  });

  const customer = data?.data;
  const { mutateAsync: deleteCustomer, isPending } =
    useDeleteCustomer(customerId);

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;

  // Show error dialog if customer fetch failed
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
    await deleteCustomer({ reason });

    toastSuccess("Customer deleted successfully");
    closeCustomerModal();
  };

  return (
    <BaseCustomerActionModal
      open={open}
      title="Delete customer"
      description={
        <>
          Permanently delete{" "}
          <span className="font-bold text-white text-sm">{customer.name}</span>.
          This action cannot be undone.
        </>
      }
      confirmText="Delete customer"
      warningText={
        <>
          I understand this action is <strong>permanent</strong> and cannot be
          undone. All customer data will be removed.
        </>
      }
      customer={customer}
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
