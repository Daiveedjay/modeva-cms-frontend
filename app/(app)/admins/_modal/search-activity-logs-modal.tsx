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

  const debouncedStore = useDebounce(store, 1000);

  const searchParams_ = useMemo(
    () => buildSearchParams(debouncedStore, page),
    [debouncedStore, page],
  );

  const hasFilters = hasActiveFilters(debouncedStore);

  const { data, isLoading, isError, isFetching, refetch } =
    useSearchAdminActivityLogs(searchParams_, hasFilters);

  const logData = data?.data?.logs || [];

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
        <DialogContent className="w-[calc(100vw-2rem)] min-w-0 lg:min-w-4xl max-h-[90dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Search Activity Logs</DialogTitle>
            <DialogDescription>
              Search and filter admin activities by admin name, email, resource
              type, action, status, and date.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <ActivityLogsFilterGrid store={store} />

          <ActiveActivityLogsFilterChips
            store={store}
            activeFilterCount={activeFilterCount}
          />

          <Separator />

          {isError && (
            <SearchErrorBase
              title="Something Went Wrong"
              message="Unable to fetch activity logs. Please check your connection and try again."
              onRetry={refetch}
              isRetrying={isFetching}
              mainIcon={Activity}
            />
          )}

          {showPlaceholder && !isError && (
            <SearchPlaceholderBase
              isLoading={isLoading}
              title="Start Searching"
              description="Use the filters above to search for admin activities. Try filtering by admin name, email, action, status, resource type, or date range."
              mainIcon={Activity}
              floatingIcons={[Activity]}
            />
          )}

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

      <ActivityDetailsModal
        activity={selectedActivity}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
