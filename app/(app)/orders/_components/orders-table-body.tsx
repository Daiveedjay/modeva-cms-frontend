import { OrderRow } from "@/app/(app)/orders/_components/order-row";
import { useGetOrders } from "@/app/_queries/orders/get-orders";
import { TableErrorRow } from "@/components/reuseables/table-error-row";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { TableSkeleton } from "@/components/reuseables/table-skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { Order } from "@/lib/types/order";

export default function OrdersTableBody() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;

  const { data, isLoading, isError, error, isFetching, refetch } = useGetOrders(
    page,
    limit,
  );

  const ordersData = data?.data;

  if (isLoading) {
    return (
      <TableBody>
        <TableSkeleton rows={5} colSpan={7} />
      </TableBody>
    );
  }

  if (isError) {
    return (
      <TableBody>
        <TableErrorRow
          colSpan={7}
          message={error?.message}
          onRetry={() => refetch()}
        />
      </TableBody>
    );
  }

  if (data?.data?.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} className=" text-lg p-8 text-center">
            No orders found.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {ordersData?.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </TableBody>

      <TableRow>
        <TableCell colSpan={7}>
          <PaginationControls<Order> data={data} isFetching={isFetching} />
        </TableCell>
      </TableRow>
    </>
  );
}
