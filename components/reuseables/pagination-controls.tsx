import { Spinner } from "@/components/reuseables/spinner";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

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

  const { page: current_page, total_pages } = data?.meta || {
    page: 1,
    total_pages: 1,
  };

  // Calculate which page numbers to show (max 6)
  const pageNumbers = useMemo(() => {
    const maxButtons = 6;

    if (total_pages <= maxButtons) {
      return Array.from({ length: total_pages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, current_page - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > total_pages) {
      endPage = total_pages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pages: (number | string)[] = [];

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < total_pages) {
      if (endPage < total_pages - 1) {
        pages.push("...");
      }
      pages.push(total_pages);
    }

    return pages;
  }, [current_page, total_pages]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center  justify-start gap-4 my-4">
      {/* Previous Button */}
      <Button
        onClick={() => handlePageChange(Math.max(current_page - 1, 1))}
        disabled={current_page === 1 || isFetching}
        variant="outline"
        size="sm">
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 overflow-x-auto max-w-full px-2 sm:px-0 justify-start">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground">
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              onClick={() => handlePageChange(page as number)}
              disabled={isFetching}
              variant={page === current_page ? "default" : "outline"}
              size="sm"
              className="min-w-10 h-9">
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        onClick={() =>
          handlePageChange(Math.min(current_page + 1, total_pages))
        }
        disabled={current_page === total_pages || isFetching}
        variant="outline"
        size="sm">
        Next
      </Button>

      {/* Loading Indicator */}
      {isFetching && (
        <div className="hidden sm:flex items-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
