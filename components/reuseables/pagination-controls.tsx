import { Spinner } from "@/components/reuseables/spinner";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationControlsProps<T> = {
  data: ApiResponse<T[]> | undefined;
  isFetching: boolean;
};

export function PaginationControls<T>({
  data,
  isFetching,
}: PaginationControlsProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data?.meta) return null;

  const { page: current_page, total_pages } = data.meta;

  const handlePageChange = (page: number) => {
    // Update URL with page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex hover:bg-none! items-center space-x-8 mt-4">
      <Button
        onClick={() => handlePageChange(Math.max(current_page - 1, 1))}
        disabled={current_page === 1}>
        Previous
      </Button>

      {/* page number buttons */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: total_pages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            onClick={() => handlePageChange(p)}
            variant={p === current_page ? "secondary" : "outline"}>
            {p}
          </Button>
        ))}
      </div>

      <Button
        onClick={() =>
          handlePageChange(Math.min(current_page + 1, total_pages))
        }
        disabled={current_page === total_pages}>
        Next
      </Button>

      {isFetching && (
        <span className="ml-2 text-sm">
          <Spinner />
        </span>
      )}
    </div>
  );
}
