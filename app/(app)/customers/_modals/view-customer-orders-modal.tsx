"use client";

import { useGetCustomerOrders } from "@/app/_queries/customers/get-customer-orders";
import { TableErrorRow } from "@/components/reuseables/table-error-row";
import { DateDisplay } from "@/components/reuseables/date-display";
import { TableSkeleton } from "@/components/reuseables/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerModalStore } from "@/lib/store/customers/use-customer-modal-store";
import { getOrderStatusVariant } from "@/lib/utils";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrderModalStore } from "@/lib/store/orders/use-orders-modals-store";
import { CustomerOrder } from "@/lib/types/customer";
import { useClearQueryParams } from "@/hooks/use-clear-query-params";

export function ViewCustomerOrdersModal() {
  const customerModal = useCustomerModalStore((s) => s.customerModal);
  const closeCustomerModal = useCustomerModalStore((s) => s.closeCustomerModal);
  const openOrderModal = useOrderModalStore((store) => store.openOrderModal);

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;

  const open =
    customerModal?.type === "view-customer-orders" &&
    !!customerModal?.customer_id;

  const customerId = customerModal?.customer_id;

  const { data, isLoading, error, refetch, isFetching } = useGetCustomerOrders(
    customerId || "",
    {
      enabled: open && !!customerId,
    },
    page,
    limit,
  );

  const orders = data?.data;
  const meta_data = data?.meta;

  const router = useRouter();

  const handleViewOrder = (order_id: string) => {
    router.push(`/orders`);
    openOrderModal({
      type: "view-order-details",
      orderId: order_id,
    });

    closeCustomerModal();
  };

  const { clearParams } = useClearQueryParams();

  const handleClose = () => {
    closeCustomerModal();
    clearParams();
  };

  const currency = useMemo(() => {
    const format = (amount?: number) => {
      const n = Number(amount ?? 0);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(n);
    };

    return { format };
  }, []);

  if (!open) return null;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent className="sm:max-w-2xl flex items-center justify-center min-h-96">
          <TableSkeleton rows={5} colSpan={7} />
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !orders) {
    return (
      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent className="sm:max-w-2xl">
          <TableErrorRow
            colSpan={7}
            message={error?.message}
            onRetry={() => refetch()}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Customer Orders
          </DialogTitle>
          <DialogDescription>
            All orders from {orders[0]?.customer_name} ({meta_data?.total}{" "}
            total)
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <DateDisplay date={order.created_at} />
                    </TableCell>
                    <TableCell className="font-semibold">
                      {currency.format(order.total_amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getOrderStatusVariant(order.status)}
                        className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewOrder(order.id)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* <Separator className="my-4" /> */}

        <div className=" flex justify-between ">
          <PaginationControls<CustomerOrder>
            data={data}
            isFetching={isFetching}
          />{" "}
          <Button
            variant="outline"
            className=" self-end"
            onClick={() => handleClose()}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
