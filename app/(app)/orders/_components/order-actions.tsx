import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrderModalStore } from "@/lib/store/orders/use-orders-modals-store";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types/order";
export default function OrderActions({ order }: { order: Order }) {
  const openOrderModal = useOrderModalStore((store) => store.openOrderModal);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            openOrderModal({
              type: "view-order-details",
              orderId: order.id,
            })
          }>
          View Details
        </DropdownMenuItem>
        {order.status !== "cancelled" && (
          <DropdownMenuItem
            onClick={() =>
              openOrderModal({
                type: "update-order-status",
                orderId: order.id,
              })
            }>
            Update Status
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() =>
            openOrderModal({
              type: "manage-order-invoice",
              orderId: order.id,
            })
          }>
          Manage Invoice
        </DropdownMenuItem>
        {order.status !== "cancelled" && order.status !== "completed" && (
          <DropdownMenuItem
            className="text-destructive"
            onClick={() =>
              openOrderModal({
                type: "cancel-customer-order",
                orderId: order.id,
              })
            }>
            Cancel Order
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
