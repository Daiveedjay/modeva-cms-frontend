"use client";

import { OrderRow } from "@/app/(app)/orders/_components/order-row";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { TableSkeleton } from "@/components/reuseables/table-skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiResponse } from "@/lib/types";
import { Order } from "@/lib/types/order";

export function OrderSearchResults({
  data,
  isFetching,
}: {
  data: ApiResponse<Order[]>;
  isFetching: boolean;
}) {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">
        Showing {data?.data?.length || 0} results
      </p>
      <div className="overflow-auto max-h-[50vh] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-17.5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {isFetching ? (
            <TableSkeleton rows={5} colSpan={7} />
          ) : (
            <TableBody>
              {data?.data?.map((order: Order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="mt-4 border-t pt-4">
        <PaginationControls<Order> data={data} isFetching={isFetching} />
      </div>
    </>
  );
}
