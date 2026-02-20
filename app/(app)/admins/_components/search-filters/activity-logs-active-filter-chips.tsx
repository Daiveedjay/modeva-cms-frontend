"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { SearchActivityLogsStore } from "@/app/(app)/admins/_store/use-search-activity-logs-store";

interface ActiveActivityLogsFilterChipsProps {
  store: SearchActivityLogsStore;
  activeFilterCount: number;
}

export function ActiveActivityLogsFilterChips({
  store,
  activeFilterCount,
}: ActiveActivityLogsFilterChipsProps) {
  if (activeFilterCount === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground">
        Active filters ({activeFilterCount}):
      </span>

      {store.query.trim() && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={() => store.setQuery("")}
        >
          Query: {store.query}
          <X className="h-3 w-3" />
        </Badge>
      )}

      {store.adminEmail.trim() && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={() => store.setAdminEmail("")}
        >
          Admin: {store.adminEmail}
          <X className="h-3 w-3" />
        </Badge>
      )}

      {store.action !== "all" && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={() => store.setAction("all")}
        >
          Action: {store.action}
          <X className="h-3 w-3" />
        </Badge>
      )}

      {store.status !== "all" && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={() => store.setStatus("all")}
        >
          Status: {store.status}
          <X className="h-3 w-3" />
        </Badge>
      )}

      {store.resourceType !== "all" && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={() => store.setResourceType("all")}
        >
          Resource: {store.resourceType}
          <X className="h-3 w-3" />
        </Badge>
      )}

      {(store.dateRange?.from || store.dateRange?.to) && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={() => store.setDateRange(undefined)}
        >
          Date:{" "}
          {store.dateRange.from && format(store.dateRange.from, "MMM dd, yyyy")}
          {store.dateRange.to &&
            ` - ${format(store.dateRange.to, "MMM dd, yyyy")}`}
          <X className="h-3 w-3" />
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => store.reset()}
        className="h-6 text-xs">
        Clear all
      </Button>
    </div>
  );
}