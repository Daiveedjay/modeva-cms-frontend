"use client";

import { OrderActiveChips } from "@/app/(app)/orders/_components/search-filters/order-active-chips";
import { OrderFilterGrid } from "@/app/(app)/orders/_components/search-filters/order-filter-grid";
import { OrderSearchResults } from "@/app/(app)/orders/_components/search-filters/order-search-results";
import {
  SearchOrdersStore,
  useSearchOrdersStore,
} from "@/app/(app)/orders/_hooks/use-search-order-store";
import { useSearchOrders } from "@/app/_queries/orders/search-order-by-query";
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
import { Separator } from "@/components/ui/separator";
import { useClearQueryParams } from "@/hooks/use-clear-query-params";
import { useDebounce } from "@/lib/hooks";
import { Order } from "@/lib/types/order";
import { formatDateYYYYMMDD } from "@/lib/utils";
import {
  ClipboardList,
  ListOrdered,
  Mail,
  Search,
  User,
  WifiOff,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function SearchOrdersModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const store = useSearchOrdersStore((store) => store);

  // Debounced store for fetching
  const debouncedStore = useDebounce(store, 1000);

  const computedParams = useMemo(
    () => buildSearchParams(debouncedStore, page),
    [debouncedStore, page],
  );

  const hasFilters = hasActiveFilters(debouncedStore);

  const { data, isLoading, isError, isFetching, refetch } = useSearchOrders(
    computedParams,
    hasFilters,
  );

  const OrderData = data?.data;

  const [lastEffectiveQuery, setLastEffectiveQuery] = useState<string | null>(
    null,
  );

  const effectiveQueryFromStore = useMemo(
    () => buildHumanReadableQuery(debouncedStore),
    [debouncedStore],
  );

  if (hasFilters && effectiveQueryFromStore !== lastEffectiveQuery) {
    setLastEffectiveQuery(effectiveQueryFromStore);
  }

  const effectiveQueryToShow = lastEffectiveQuery;

  const showPlaceholder = !hasActiveFilters(store) && !isError;

  const hasResults =
    !!OrderData && OrderData.length > 0 && !!effectiveQueryToShow && !isError;

  const hasNoResults =
    !isLoading &&
    !isFetching &&
    OrderData &&
    OrderData.length === 0 &&
    !!effectiveQueryToShow;

  const { clearParams } = useClearQueryParams();

  const handleClose = () => {
    store.reset();
    setLastEffectiveQuery(null);
    clearParams();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && handleClose()}>
      <DialogContent className="max-w-6xl! max-h-5/6 overflow-y-auto w-full!">
        <DialogHeader>
          <DialogTitle>Search Orders</DialogTitle>
          <DialogDescription>
            Use the filters below to search by order number, customer, email,
            status, price, and date.
          </DialogDescription>
        </DialogHeader>

        <OrderActiveChips />

        <Separator />

        <OrderFilterGrid />

        <Separator />

        {isError && (
          <SearchErrorBase
            title="Something Went Wrong"
            message="Unable to fetch orders. Please check your connection and try again."
            onRetry={refetch}
            isRetrying={isFetching}
            mainIcon={ListOrdered}
            floatingIcon={WifiOff}
          />
        )}

        {showPlaceholder && (
          <SearchPlaceholderBase
            isLoading={isLoading}
            title="Find Your Orders"
            description="Use the filters above, or type free text to search order number, customer name, or email."
            suggestions={[
              "ORD-2025",
              "David",
              "gmail.com",
              "pending",
              "processing",
            ]}
            mainIcon={ClipboardList}
            floatingIcons={[Search, User, Mail]}
          />
        )}

        {hasNoResults && (
          <SearchNoResultBase
            query={effectiveQueryToShow!}
            icon={ListOrdered}
            title="No Orders Found"
            suggestions={[
              "Check your spelling",
              "Try broader search terms",
              "Use fewer keywords",
              "Remove some filters",
            ]}
          />
        )}

        {hasResults && data && (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Showing results for: &quot;{effectiveQueryToShow}&quot;
            </p>
            <OrderSearchResults data={data} isFetching={isFetching} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- helpers ---------------- */

function hasActiveFilters(store: SearchOrdersStore): boolean {
  return (
    store.orderNumber.trim() !== "" ||
    store.customer.trim() !== "" ||
    store.email.trim() !== "" ||
    store.status !== "all" ||
    store.dateRange?.from !== undefined ||
    store.dateRange?.to !== undefined ||
    store.useExactPrice ||
    store.exactPrice !== undefined ||
    store.priceRange[0] !== 0 ||
    store.priceRange[1] !== 10000
  );
}

function buildHumanReadableQuery(store: SearchOrdersStore): string {
  const parts: string[] = [];

  if (store.orderNumber.trim()) parts.push(store.orderNumber);
  if (store.customer.trim()) parts.push(store.customer);
  if (store.email.trim()) parts.push(store.email);
  if (store.status !== "all") parts.push(store.status);

  if (store.dateRange?.from)
    parts.push(`from ${formatDateYYYYMMDD(store.dateRange.from)}`);
  if (store.dateRange?.to)
    parts.push(`to ${formatDateYYYYMMDD(store.dateRange.to)}`);

  if (store.useExactPrice && store.exactPrice !== undefined) {
    parts.push(`price ${store.exactPrice}`);
  } else {
    if (store.priceRange[0] > 0) parts.push(`min ${store.priceRange[0]}`);
    if (store.priceRange[1] < 10000) parts.push(`max ${store.priceRange[1]}`);
  }

  return parts.join(", ");
}

interface SearchParams {
  page: number;
  limit: number;
  order_number: string | undefined;
  customer: string | undefined;
  email: string | undefined;
  status: Order["status"] | undefined;
  price: number | undefined;
  min_price: number | undefined;
  max_price: number | undefined;
  created_from: string | undefined;
  created_to: string | undefined;
}

function buildSearchParams(
  store: SearchOrdersStore,
  page: number,
): SearchParams {
  return {
    page,
    limit: 5,
    order_number: store.orderNumber.trim() || undefined,
    customer: store.customer.trim() || undefined,
    email: store.email.trim() || undefined,
    status: store.status !== "all" ? store.status : undefined,
    price: store.useExactPrice ? store.exactPrice : undefined,
    min_price:
      !store.useExactPrice && store.priceRange[0] > 0
        ? store.priceRange[0]
        : undefined,
    max_price:
      !store.useExactPrice && store.priceRange[1] < 10000
        ? store.priceRange[1]
        : undefined,
    created_from: store.dateRange?.from
      ? formatDateYYYYMMDD(store.dateRange.from)
      : undefined,
    created_to: store.dateRange?.to
      ? formatDateYYYYMMDD(store.dateRange.to)
      : undefined,
  };
}
