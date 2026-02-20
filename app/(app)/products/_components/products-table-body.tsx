import { useGetProducts } from "@/app/_queries/products/get-products";
import { ProductRow } from "@/app/(app)/products/_components/product-row";
import { TableErrorRow } from "@/components/reuseables/table-error-row";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { TableSkeleton } from "@/components/reuseables/table-skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/lib/store/product/use-product-manager-store";
import { useSearchParams } from "next/navigation";

export default function ProductsTableBody() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;
  const { data, isError, isLoading, isFetching, error, refetch } =
    useGetProducts(page, limit);

  console.log(data?.data);

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
            No products found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {data?.data?.map((product) => (
          <ProductRow key={product.basic_info.id} product={product} />
        ))}
      </TableBody>
      <TableRow>
        <TableCell colSpan={7}>
          <PaginationControls<Product> data={data} isFetching={isFetching} />
        </TableCell>
      </TableRow>
    </>
  );
}
