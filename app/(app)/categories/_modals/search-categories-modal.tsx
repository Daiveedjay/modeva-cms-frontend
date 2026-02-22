"use client";

import { useSearchCategories } from "@/app/_queries/categories/search-categories";

import { CategoryRow } from "@/app/(app)/categories/_components/category-row";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { SearchPlaceholderBase } from "@/components/reuseables/search-placeholder-base";
import { Spinner } from "@/components/reuseables/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/lib/hooks";
import { useState, type JSX } from "react";

import { SearchErrorBase } from "@/components/reuseables/search-error-base";
import { SearchNoResultBase } from "@/components/reuseables/search-no-result-base";
import { FolderTree, WifiOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Category } from "@/lib/types/category";
import { useClearQueryParams } from "@/hooks/use-clear-query-params";
import { AdminOnly } from "@/components/reuseables/admin-only";

// Enhanced Placeholder Component
export function SearchCategoriesModal({
  open,
  onClose,
  query,
  setQuery,
}: {
  open: boolean;
  query: string;
  setQuery: (q: string) => void;
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const debouncedQuery = useDebounce(query, 500);
  const limit = 5;

  // Keep lastFetchedQuery to still show data when input is cleared
  const [lastFetchedQuery, setLastFetchedQuery] = useState<string | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useSearchCategories(
    debouncedQuery,
    page,
    limit,
  );

  function renderCategory(
    cat: Category,
    parent?: Category,
    level = 0,
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

  // Update lastFetchedQuery when new non-empty query comes in
  if (debouncedQuery && debouncedQuery !== lastFetchedQuery) {
    setLastFetchedQuery(debouncedQuery);
  }

  const effectiveQueryToShow = lastFetchedQuery;

  const hasResults = !!(
    data?.data &&
    data.data.length > 0 &&
    effectiveQueryToShow
  );
  const hasNoResults = !!(
    effectiveQueryToShow &&
    !isLoading &&
    data &&
    data.data &&
    data.data.length === 0
  );
  const showPlaceholder =
    !effectiveQueryToShow || (!hasResults && !hasNoResults);

  const { clearParams } = useClearQueryParams();

  const handleClose = () => {
    setLastFetchedQuery(null);
    onClose();
    clearParams();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) handleClose();
      }}>
      <DialogContent className="max-w-6xl! w-full! overflow-auto ">
        <DialogHeader>
          <DialogTitle>Search Categories</DialogTitle>
          <DialogDescription>
            Quickly find categories or subcategories by name or description.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="flex items-center gap-2 mb-4">
          <Input
            autoFocus
            placeholder="Type to search categories..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="w-80"
          />
          {isLoading && (
            <span className="ml-4 text-sm flex items-center gap-2 text-muted-foreground">
              <Spinner /> Searching...
            </span>
          )}
        </div>

        {/* Error */}
        {isError && (
          <SearchErrorBase
            title="Something Went Wrong"
            message={`Unable to fetch categories. Please check your connection and try again.`}
            onRetry={refetch}
            isRetrying={isFetching}
            mainIcon={FolderTree}
            floatingIcon={WifiOff}
          />
        )}

        {/* Show placeholder (greyed out during loading) */}
        {showPlaceholder && !isError && (
          <SearchPlaceholderBase
            setQuery={setQuery}
            isLoading={isLoading}
            title="Discover Categories"
            description="Start typing to explore your category hierarchy."
            suggestions={["Electronics", "Books", "Home & Garden"]}
            mainIcon={FolderTree}
            floatingIcons={[FolderTree]}
          />
        )}

        {/* No results state */}
        {hasNoResults && (
          <SearchNoResultBase
            query={effectiveQueryToShow!}
            title="No Categories Found"
            icon={FolderTree}
            suggestions={[
              "Check your spelling",
              "Try broader search terms",
              "Use fewer keywords",
              "Search for parent categories",
            ]}
          />
        )}

        {/* Show results if we have data */}
        {hasResults && (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Showing results for: &quot;{effectiveQueryToShow}&quot;
            </p>
            <div className="overflow-auto max-h-[50vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <AdminOnly>
                      {" "}
                      <TableHead>Actions</TableHead>
                    </AdminOnly>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data?.flatMap((cat) => renderCategory(cat))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 border-t pt-4">
              <PaginationControls<Category>
                data={data}
                isFetching={isFetching}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
