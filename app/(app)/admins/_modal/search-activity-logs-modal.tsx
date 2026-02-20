"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchAdminActivityLogs } from "@/app/_queries/admin/search-admin-activity-logs";
import { ActivityDetailsModal } from "@/app/(app)/admins/_modal/activity-details-modal";
import { ActivityLogsFilterGrid } from "@/app/(app)/admins/_components/search-filters/activity-logs-filter-grid";
import { ActiveActivityLogsFilterChips } from "@/app/(app)/admins/_components/search-filters/activity-logs-active-filter-chips";
import { ActivityLogsSearchResults } from "@/app/(app)/admins/_components/search-filters/activity-logs-search-results";
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
import { useDebounce } from "@/lib/hooks";
import { Activity } from "lucide-react";
import { useSearchActivityLogsStore } from "@/app/(app)/admins/_store/use-search-activity-logs-store";

import {
  hasActiveFilters,
  buildSearchParams,
  countActiveFilters,
} from "@/app/(app)/admins/_store/activity-logs-search-helpers";
import { ActivityLog } from "@/lib/types/admin";
import { useClearQueryParams } from "@/hooks/use-clear-query-params";

export function SearchActivityLogsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 5);

  const store = useSearchActivityLogsStore((store) => store);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Debounce the store
  const debouncedStore = useDebounce(store, 1000);

  // Build params from debounced store
  const searchParams_ = useMemo(
    () => buildSearchParams(debouncedStore, page),
    [debouncedStore, page],
  );

  // Check filters on debounced store
  const hasFilters = hasActiveFilters(debouncedStore);

  // Fetch only when filters exist
  const { data, isLoading, isError, isFetching, refetch } =
    useSearchAdminActivityLogs(searchParams_, hasFilters);

  const logData = data?.data?.logs || [];

  // Determine state
  const showPlaceholder = !hasActiveFilters(store) && !isError;
  const hasResults = !!logData && logData.length > 0 && hasFilters && !isError;
  const hasNoResults =
    !isLoading && !isFetching && logData && logData.length === 0 && hasFilters;

  const activeFilterCount = countActiveFilters(store);

  const { clearParams } = useClearQueryParams();

  const handleClose = () => {
    store.reset();
    clearParams();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen) handleClose();
        }}>
        <DialogContent className="max-w-6xl! w-full! overflow-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Search Activity Logs</DialogTitle>
            <DialogDescription>
              Search and filter admin activities by admin name, email, resource
              type, action, status, and date.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {/* Filter Grid */}
          <ActivityLogsFilterGrid store={store} />

          {/* Active Filters */}
          <ActiveActivityLogsFilterChips
            store={store}
            activeFilterCount={activeFilterCount}
          />

          <Separator />

          {/* Error */}
          {isError && (
            <SearchErrorBase
              title="Something Went Wrong"
              message="Unable to fetch activity logs. Please check your connection and try again."
              onRetry={refetch}
              isRetrying={isFetching}
              mainIcon={Activity}
            />
          )}

          {/* Placeholder */}
          {showPlaceholder && !isError && (
            <SearchPlaceholderBase
              isLoading={isLoading}
              title="Start Searching"
              description="Use the filters above to search for admin activities. Try filtering by admin name, email, action, status, resource type, or date range."
              // suggestions={[
              //   "Search by admin name",
              //   "Filter by admin email",
              //   "Find failed operations",
              //   "Filter by date range",
              // ]}
              mainIcon={Activity}
              floatingIcons={[Activity]}
            />
          )}

          {/* No Results */}
          {hasNoResults && (
            <SearchNoResultBase
              query={store.query || "your filters"}
              title="No Activities Found"
              icon={Activity}
              suggestions={[
                "Try different keywords",
                "Change the action or status filter",
                "Adjust the date range",
                "Check the admin email",
                "Clear some filters and try again",
              ]}
            />
          )}

          {/* Results */}
          {hasResults && (
            <ActivityLogsSearchResults
              logs={logData}
              query={store.query}
              data={data}
              isFetching={isFetching}
              onActivityClick={(activity) => {
                setSelectedActivity(activity);
                setDetailsOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <ActivityDetailsModal
        activity={selectedActivity}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
