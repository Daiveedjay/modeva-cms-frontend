import {
  useGetCategories,
} from "@/app/_queries/categories/get-categories";
import { CategoryRow } from "@/app/(app)/categories/_components/category-row";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { TableSkeleton } from "@/components/reuseables/table-skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { JSX } from "react";
import { Category } from "@/lib/types/category";

export function CategoryTableBody() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;

  const { data, isLoading, isError, isFetching } = useGetCategories(
    page,
    limit
  );

  /**
   * Helper function to recursively flatten the category tree into table rows.
   * Using a function declaration instead of a const/useCallback allows
   * the function to call itself recursively without initialization errors.
   */
  function renderCategory(
    cat: Category,
    parent?: Category,
    level = 0
  ): JSX.Element[] {
    const rows: JSX.Element[] = [
      <CategoryRow key={cat.id} category={cat} parent={parent} level={level} />,
    ];

    if (cat.children && cat.children.length > 0) {
      cat.children.forEach((child) => {
        rows.push(...renderCategory(child, cat, level + 1));
      });
    }

    return rows;
  }

  if (isLoading) {
    return (
      <TableBody>
        <TableSkeleton />
      </TableBody>
    );
  }

  if (isError) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} className="text-center py-4">
            Failed to load categories
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (data?.data?.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} className="text-center p-8 text-lg">
            No categories found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <TableBody>
      {/* We use flatMap on the top-level categories to transform 
        the nested tree into a single flat array of <tr> elements. 
      */}
      {data?.data && data.data.flatMap((cat) => renderCategory(cat))}
      <TableRow>
        <TableCell colSpan={6}>
          <PaginationControls<Category> data={data} isFetching={isFetching} />
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
