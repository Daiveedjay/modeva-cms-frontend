"use client";

import { CustomerActiveChips } from "@/app/(app)/customers/_components/customer-active-chips";
import { CustomerFilterGrid } from "@/app/(app)/customers/_components/customer-filter-grid";
import { CustomerSearchResults } from "@/app/(app)/customers/_components/customer-search-results";
import {
  SearchCustomersStore,
  useSearchCustomersStore,
} from "@/app/(app)/customers/_hooks/use-search-customers-store";
import { useSearchCustomers } from "@/app/_queries/customers/search-customers";
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
import { SearchCustomersFilters } from "@/lib/types/customer";
import { Mail, Search, Users, WifiOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function SearchCustomersModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const store = useSearchCustomersStore((store) => store);

  // Debounce the entire store to avoid excessive API calls
  const debouncedStore = useDebounce(store, 1000);

  const computedFilters = useMemo(
    () => buildFilters(debouncedStore),
    [debouncedStore],
  );

  const hasFilters = hasActiveFilters(debouncedStore);

  const { data, isLoading, isError, isFetching, refetch } = useSearchCustomers(
    computedFilters,
    page,
    5,
    hasFilters,
  );

  const customerData = data?.data;

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

  // Responsive placeholder (raw store)
  const showPlaceholder = !hasActiveFilters(store) && !isError;

  const hasResults =
    !!customerData &&
    customerData.length > 0 &&
    !!effectiveQueryToShow &&
    !isError;

  const hasNoResults =
    !isLoading &&
    !isFetching &&
    customerData &&
    customerData.length === 0 &&
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
          <DialogTitle>Search Customers</DialogTitle>
          <DialogDescription>
            Use the filters below to search by name, country, status, join date,
            and spending.
          </DialogDescription>
        </DialogHeader>

        <CustomerActiveChips />

        <Separator />

        <CustomerFilterGrid />

        <Separator />

        {isError && (
          <SearchErrorBase
            title="Something Went Wrong"
            message="Unable to fetch customers. Please check your connection and try again."
            onRetry={refetch}
            isRetrying={isFetching}
            mainIcon={Users}
            floatingIcon={WifiOff}
          />
        )}

        {showPlaceholder && (
          <SearchPlaceholderBase
            isLoading={isLoading}
            title="Find Your Customers"
            description="Use the filters above to search by name, country, status, join date, and spending."
            suggestions={[
              "John Doe",
              "United States",
              "Active",
              "2025",
              "$500",
            ]}
            mainIcon={Users}
            floatingIcons={[Search, Mail]}
          />
        )}

        {hasNoResults && (
          <SearchNoResultBase
            query={effectiveQueryToShow!}
            title="No Customers Found"
            icon={Users}
            suggestions={[
              "Check your filters",
              "Try different date ranges",
              "Verify the country name",
              "Adjust spending range",
            ]}
          />
        )}

        {hasResults && data && (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Showing results for: &quot;{effectiveQueryToShow}&quot;
            </p>
            <CustomerSearchResults data={data} isFetching={isFetching} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- helpers ---------------- */

function hasActiveFilters(store: SearchCustomersStore): boolean {
  return (
    store.name.trim() !== "" ||
    store.email.trim() !== "" ||
    store.country.trim() !== "" ||
    store.status !== "all" ||
    (store.useDateRange &&
      (store.dateRange?.from !== undefined ||
        store.dateRange?.to !== undefined)) ||
    (!store.useDateRange && store.exactJoinedDate !== undefined) ||
    store.useExactSpending ||
    store.exactSpending > 0 ||
    store.spendingRange[0] !== 0 ||
    store.spendingRange[1] !== 10000000
  );
}

function buildHumanReadableQuery(store: SearchCustomersStore): string {
  const parts: string[] = [];

  if (store.name.trim()) parts.push(store.name);
  if (store.email.trim()) parts.push(store.email);
  if (store.country.trim()) parts.push(store.country);
  if (store.status !== "all") parts.push(store.status);

  if (store.useDateRange) {
    if (store.dateRange?.from)
      parts.push(`from ${store.dateRange.from.toISOString().slice(0, 10)}`);
    if (store.dateRange?.to)
      parts.push(`to ${store.dateRange.to.toISOString().slice(0, 10)}`);
  } else if (store.exactJoinedDate) {
    parts.push(`joined ${store.exactJoinedDate.toISOString().slice(0, 10)}`);
  }

  if (store.useExactSpending && store.exactSpending > 0) {
    parts.push(`spending ${store.exactSpending}`);
  } else {
    if (store.spendingRange[0] > 0) parts.push(`min ${store.spendingRange[0]}`);
    if (store.spendingRange[1] < 10000000)
      parts.push(`max ${store.spendingRange[1]}`);
  }

  return parts.join(", ");
}

function buildFilters(store: SearchCustomersStore): SearchCustomersFilters {
  return {
    query: store.name.trim(),
    email: store.email.trim(),
    status: store.status,
    joinedFrom: store.useDateRange
      ? store.dateRange?.from
      : store.exactJoinedDate,
    joinedTo: store.useDateRange ? store.dateRange?.to : undefined,
    country: store.country.trim() || undefined,
    useExactSpending: store.useExactSpending,
    exactSpending: store.exactSpending,
    spendingMin: !store.useExactSpending ? store.spendingRange[0] : undefined,
    spendingMax: !store.useExactSpending ? store.spendingRange[1] : undefined,
  };
}
