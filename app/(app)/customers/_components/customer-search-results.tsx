import { ApiResponse } from "@/lib/types";
import { CustomerListItem } from "@/lib/types/customer";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomerRow from "@/app/(app)/customers/_components/customer-row";
export function CustomerSearchResults({
  data,
  isFetching,
}: {
  data: ApiResponse<CustomerListItem[]>;
  isFetching: boolean;
}) {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        Found {data?.meta?.total || 0} customer
        {(data?.meta?.total || 0) !== 1 ? "s" : ""}
      </p>
      <div className="overflow-auto max-h-[50vh] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="w-17.5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 border-t pt-4">
        <PaginationControls data={data} isFetching={isFetching} />
      </div>
    </>
  );
}
