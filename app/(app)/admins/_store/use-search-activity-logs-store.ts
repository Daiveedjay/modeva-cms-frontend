import { create } from "zustand";
import { DateRange } from "react-day-picker";
import {
  ActivityAction,
  ActivityStatus,
  ResourceType,
} from "@/lib/types/admin";

type ActionFilter = ActivityAction | "all";
type StatusFilter = ActivityStatus | "all";
type ResourceTypeFilter = ResourceType | "all";

export interface SearchActivityLogsStore {
  query: string;
  setQuery: (query: string) => void;

  adminEmail: string;
  setAdminEmail: (email: string) => void;

  action: ActionFilter;
  setAction: (action: ActionFilter) => void;

  status: StatusFilter;
  setStatus: (status: StatusFilter) => void;

  resourceType: ResourceTypeFilter;
  setResourceType: (type: ResourceTypeFilter) => void;

  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;

  reset: () => void;
}

export const useSearchActivityLogsStore = create<SearchActivityLogsStore>(
  (set) => ({
    query: "",
    setQuery: (query) => set({ query }),

    adminEmail: "",
    setAdminEmail: (adminEmail) => set({ adminEmail }),

    action: "all",
    setAction: (action) => set({ action }),

    status: "all",
    setStatus: (status) => set({ status }),

    resourceType: "all",
    setResourceType: (resourceType) => set({ resourceType }),

    dateRange: undefined,
    setDateRange: (dateRange) => set({ dateRange }),

    reset: () =>
      set({
        query: "",
        adminEmail: "",
        action: "all",
        status: "all",
        resourceType: "all",
        dateRange: undefined,
      }),
  }),
);
