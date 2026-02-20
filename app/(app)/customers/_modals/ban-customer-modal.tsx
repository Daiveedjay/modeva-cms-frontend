import { useBanCustomer } from "@/app/_queries/customers/ban-customer";
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
import { toastSuccess } from "@/lib/utils";

export function BanCustomerModal() {
  const { customerModal, closeCustomerModal } = useCustomerModalStore();

  const open =
    customerModal?.type === "ban-customer" && !!customerModal?.customer_id;

  const customerId = customerModal?.customer_id || "";

  const { data, isLoading, error } = useGetCustomerById(customerId, {
    enabled: open,
  });

  const customer = data?.data;
  const { mutateAsync: banCustomer, isPending } = useBanCustomer(customerId);

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
    await banCustomer({ reason });

    toastSuccess("Customer banned successfully");
    closeCustomerModal();
  };

  return (
    <BaseCustomerActionModal
      open={open}
      title="Ban customer"
      description={
        <>
          Ban{" "}
          <span className="font-bold text-white text-sm">{customer.name}</span>.
          This action is temporary and the customer can be unbanned later.
        </>
      }
      confirmText="Ban customer"
      warningText={
        <>
          I understand this will <strong>temporarily ban</strong> the customer.
          The account and data will be retained.
        </>
      }
      customer={customer}
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
