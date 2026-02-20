import AdminRow from "@/app/(app)/admins/_components/admin-row";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { TableErrorRow } from "@/components/reuseables/table-error-row";
import { TableSkeleton } from "@/components/reuseables/table-skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Admin } from "@/lib/types/admin";
import { useSearchParams } from "next/navigation";
import { useGetAdmins } from "@/app/_queries/admin/get-admins";

export default function AdminTableBody() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;

  const { data, isLoading, isError, error, isFetching, refetch } = useGetAdmins(
    page,
    limit,
  );

  const adminsData = data?.data;

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
            No admins found.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {adminsData?.map((admin) => (
          <AdminRow key={admin.id} admin={admin} />
        ))}

        <TableRow>
          <TableCell colSpan={6}>
            <PaginationControls<Admin> data={data} isFetching={isFetching} />
          </TableCell>
        </TableRow>
      </TableBody>
    </>
  );
}
