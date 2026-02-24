import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomerModalStore } from "@/lib/store/customers/use-customer-modal-store";
import { CustomerListItem } from "@/lib/types/customer";

import { MoreHorizontal } from "lucide-react";

export default function CustomerActions({
  customer,
}: {
  customer: CustomerListItem;
}) {
  const openCustomerModal = useCustomerModalStore(
    (store) => store.openCustomerModal,
  );

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
            openCustomerModal({
              customer_id: customer.id,

              type: "view-customer-profile",
            })
          }>
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            openCustomerModal({
              customer_id: customer.id,
              type: "update-customer-profile",
            })
          }>
          Update Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            openCustomerModal({
              customer_id: customer.id,
              type: "view-customer-orders",
            })
          }>
          View Orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            openCustomerModal({
              customer_id: customer.id,
              type: "send-customer-email",
            })
          }>
          Send Email
        </DropdownMenuItem>
        {customer.status === "banned" ? (
          <DropdownMenuItem
            className="text-success"
            onClick={() =>
              openCustomerModal({
                customer_id: customer.id,
                type: "unban-customer",
              })
            }>
            Unban Customer
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() =>
              openCustomerModal({
                customer_id: customer.id,
                type: "ban-customer",
              })
            }>
            Ban Customer
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-[#F87C63] "
          onClick={() =>
            openCustomerModal({
              customer_id: customer.id,
              type: "delete-customer",
            })
          }>
          Delete Customer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
