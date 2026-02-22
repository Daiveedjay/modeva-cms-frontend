"use client";

import OrderActions from "@/app/(app)/orders/_components/order-actions";
import { AdminOnly } from "@/components/reuseables/admin-only";
import { getStatusIcon } from "@/components/reuseables/get-status-icon";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Order } from "@/lib/types/order";
import { getOrderStatusVariant } from "@/lib/utils";

export function OrderRow({ order }: { order: Order }) {
  return (
    <TableRow key={order.id}>
      <TableCell className="font-medium">{order.order_number}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{order.customer_name}</span>
          <span className="text-sm text-muted-foreground">
            {order.customer_email}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-sm">
        {new Date(order.created_at).toLocaleString()}
      </TableCell>
      <TableCell className="text-sm">{order.item_count}</TableCell>
      <TableCell className="text-sm font-medium">
        ${Number(order.total_amount ?? 0).toLocaleString("en-US")}{" "}
      </TableCell>

      <TableCell>
        <Badge
          variant={getOrderStatusVariant(order.status)}
          className="flex items-center gap-1 capitalize w-fit">
          {getStatusIcon(order.status)}
          {order.status}
        </Badge>
      </TableCell>
      <AdminOnly>
        {" "}
        <TableCell>
          <OrderActions order={order} />
        </TableCell>
      </AdminOnly>
    </TableRow>
  );
}
