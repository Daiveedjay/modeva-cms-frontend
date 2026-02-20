import { SearchActivityLogsStore } from "@/app/(app)/admins/_store/use-search-activity-logs-store";
import { ActivityLogSearchParams } from "@/lib/types/admin";
import { formatDateYYYYMMDD } from "@/lib/utils";

// Check if any filters are active
export function hasActiveFilters(store: SearchActivityLogsStore): boolean {
  return (
    store.query.trim() !== "" ||
    store.adminEmail.trim() !== "" ||
    store.action !== "all" ||
    store.status !== "all" ||
    store.resourceType !== "all" ||
    store.dateRange?.from !== undefined ||
    store.dateRange?.to !== undefined
  );
}

export function buildSearchParams(
  store: SearchActivityLogsStore,
  page: number,
): ActivityLogSearchParams {
  return {
    page,
    limit: 5,
    query: store.query.trim() || undefined,
    admin_email: store.adminEmail.trim() || undefined,
    action: store.action !== "all" ? store.action : undefined,
    status: store.status !== "all" ? store.status : undefined,
    resource_type:
      store.resourceType !== "all" ? store.resourceType : undefined,
    created_from: store.dateRange?.from
      ? formatDateYYYYMMDD(store.dateRange.from)
      : undefined,
    created_to: store.dateRange?.to
      ? formatDateYYYYMMDD(store.dateRange.to)
      : undefined,
  };
}
// Count active filters
export function countActiveFilters(store: SearchActivityLogsStore): number {
  return [
    store.query.trim(),
    store.adminEmail.trim(),
    store.action !== "all",
    store.status !== "all",
    store.resourceType !== "all",
    store.dateRange?.from || store.dateRange?.to,
  ].filter(Boolean).length;
}
