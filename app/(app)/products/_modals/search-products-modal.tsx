"use client";

import { useDebounce } from "@/lib/hooks";
import { useState } from "react";

import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { Spinner } from "@/components/reuseables/spinner";
import { TableSkeleton } from "@/components/reuseables/table-skeleton";
import { Product } from "@/lib/store/product/use-product-manager-store";
import { ShoppingBag, Tag, WifiOff } from "lucide-react";

import { useSearchProducts } from "@/app/_queries/products/search-products";
import { SearchErrorBase } from "@/components/reuseables/search-error-base";
import { SearchNoResultBase } from "@/components/reuseables/search-no-result-base";
import { SearchPlaceholderBase } from "@/components/reuseables/search-placeholder-base";
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
import { useSearchParams } from "next/navigation";
import { ProductRow } from "@/app/(app)/products/_components/product-row";
import { useClearQueryParams } from "@/hooks/use-clear-query-params";

export function SearchProductsModal({
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
  const debouncedQuery = useDebounce(query, 500);
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;

  const [lastFetchedQuery, setLastFetchedQuery] = useState<string | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useSearchProducts(
    debouncedQuery,
    page,
    limit,
  );

  if (debouncedQuery && debouncedQuery !== lastFetchedQuery) {
    setLastFetchedQuery(debouncedQuery);
  }

  const effectiveQueryToShow = lastFetchedQuery;

  const hasResults = !!data?.data?.length && !!effectiveQueryToShow && !isError;
  const hasNoResults =
    !!effectiveQueryToShow &&
    !isLoading &&
    !isFetching &&
    data?.data?.length === 0;
  const showPlaceholder = !effectiveQueryToShow && !isError;

  const { clearParams } = useClearQueryParams();

  const handleClose = () => {
    setLastFetchedQuery(null);
    clearParams();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) handleClose();
      }}>
      <DialogContent className="w-[calc(100vw-2rem)] min-w-0 lg:min-w-4xl max-h-[90dvh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>
            Quickly find products by name, description, or tags.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="flex items-center gap-2 mb-4">
          <Input
            autoFocus
            placeholder="Type to search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-sm"
          />
          {isLoading && (
            <span className="ml-2 text-sm flex items-center gap-2 text-muted-foreground shrink-0">
              <Spinner /> Searching...
            </span>
          )}
        </div>

        {/* Error state */}
        {isError && (
          <SearchErrorBase
            title="Couldn't Fetch Products"
            message="Unable to search products. Please try again in a moment."
            onRetry={refetch}
            isRetrying={isFetching}
            mainIcon={ShoppingBag}
            floatingIcon={WifiOff}
          />
        )}

        {showPlaceholder && !isError && (
          <SearchPlaceholderBase
            setQuery={setQuery}
            isLoading={isLoading}
            title="Find Your Products"
            description="Start typing to find products by name, description, or tags."
            suggestions={["Sneakers", "Smartwatch", "Sunglasses"]}
            mainIcon={ShoppingBag}
            floatingIcons={[ShoppingBag, Tag]}
          />
        )}

        {hasNoResults && (
          <SearchNoResultBase
            query={effectiveQueryToShow!}
            title="No Products Found"
            icon={ShoppingBag}
            suggestions={[
              "Check your spelling",
              "Try searching by product tag",
              "Use fewer or broader keywords",
              "Search by category name",
            ]}
          />
        )}

        {hasResults && (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Showing results for: &quot;{effectiveQueryToShow}&quot;
            </p>
            <div className="overflow-auto max-h-[50dvh] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Sub-category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-17.5">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                {isFetching ? (
                  <TableSkeleton rows={5} colSpan={7} />
                ) : (
                  <TableBody>
                    {data?.data?.map((product) => (
                      <ProductRow
                        key={product.basic_info.id}
                        product={product}
                      />
                    ))}
                  </TableBody>
                )}
              </Table>
            </div>

            <div className="mt-4 border-t pt-4">
              <PaginationControls<Product>
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
