import {
  useGetCustomers,
} from "@/app/_queries/customers/get-customers";


import { TableErrorRow } from "@/components/reuseables/table-error-row";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { TableSkeleton } from "@/components/reuseables/table-skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import CustomerRow from "@/app/(app)/customers/_components/customer-row";
import { CustomerListItem } from "@/lib/types/customer";
export default function CustomerTableBody() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;
  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetCustomers(page, limit);

  const customerData = data?.data;

  if (isLoading) {
    return <TableSkeleton rows={5} colSpan={7} />;
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
            No customers found.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {customerData?.map((customer) => (
          <CustomerRow key={customer.id} customer={customer} />
        ))}
      </TableBody>

      <TableRow>
        <TableCell colSpan={8}>
          <PaginationControls<CustomerListItem> data={data} isFetching={isFetching} />
        </TableCell>
      </TableRow>
    </>
  );
}
