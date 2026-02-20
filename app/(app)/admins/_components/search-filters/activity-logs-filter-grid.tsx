"use client";

import { SearchActivityLogsStore } from "@/app/(app)/admins/_store/use-search-activity-logs-store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

const RESOURCE_TYPE_OPTIONS = [
  { value: "all", label: "All Resources" },
  { value: "category", label: "Category" },
  { value: "product", label: "Product" },
  { value: "order", label: "Order" },
  { value: "admin", label: "Admin" },
  { value: "customer", label: "Customer" },
];

const ACTION_OPTIONS = [
  { value: "all", label: "All Actions" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deleted", label: "Deleted" },
];

interface ActivityLogsFilterGridProps {
  store: SearchActivityLogsStore;
}

export function ActivityLogsFilterGrid({ store }: ActivityLogsFilterGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Row 1 */}

      {/* Admin Name */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-2">
          Admin Name
        </label>
        <Input
          placeholder="Search admin name..."
          value={store.query}
          onChange={(e) => store.setQuery(e.target.value)}
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-2">
          Admin Email
        </label>
        <Input
          placeholder="Filter by admin email..."
          value={store.adminEmail}
          onChange={(e) => store.setAdminEmail(e.target.value)}
        />
      </div>

      {/* Resource Type */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-2">
          Resource Type
        </label>
        <Select
          value={store.resourceType}
          onValueChange={store.setResourceType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Row 2 */}

      {/* Action */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-2">
          Action
        </label>
        <Select value={store.action} onValueChange={store.setAction}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-2">
          Status
        </label>
        <Select value={store.status} onValueChange={store.setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-2">
          Date Range
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !store.dateRange && "text-muted-foreground",
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {store.dateRange?.from ? (
                store.dateRange.to ? (
                  <>
                    {format(store.dateRange.from, "LLL dd, y")} -{" "}
                    {format(store.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(store.dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
              {store.dateRange?.from && (
                <X
                  className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    store.setDateRange(undefined);
                  }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              autoFocus
              mode="range"
              defaultMonth={store.dateRange?.from}
              selected={store.dateRange}
              onSelect={store.setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
