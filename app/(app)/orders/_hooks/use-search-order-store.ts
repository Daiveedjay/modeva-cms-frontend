// lib/store/orders/use-search-orders-store.ts
import { create } from "zustand";
import type { DateRange } from "react-day-picker";
import { Order } from "@/lib/types/order";

export interface SearchOrdersStore {
  // Filters
  orderNumber: string;
  customer: string;
  email: string;
  status: Order["status"] | "all";
  useExactPrice: boolean;
  exactPrice: number | undefined;
  priceRange: [number, number];
  dateRange: DateRange | undefined;

  // Actions
  setOrderNumber: (v: string) => void;
  setCustomer: (v: string) => void;
  setEmail: (v: string) => void;
  setStatus: (v: Order["status"] | "all") => void;
  setUseExactPrice: (v: boolean) => void;
  setExactPrice: (v: number | undefined) => void;
  setPriceRange: (v: [number, number]) => void;
  setDateRange: (v: DateRange | undefined) => void;

  // Clear individual filters
  clearOrderNumber: () => void;
  clearCustomer: () => void;
  clearEmail: () => void;
  clearStatus: () => void;
  clearPrice: () => void;
  clearDateRange: () => void;

  // Clear all
  clearAllFilters: () => void;
  reset: () => void;
}

const INITIAL_STATE = {
  orderNumber: "",
  customer: "",
  email: "",
  status: "all" as const,
  useExactPrice: false,
  exactPrice: undefined,
  priceRange: [0, 10000] as [number, number],
  dateRange: undefined as DateRange | undefined,
};

export const useSearchOrdersStore = create<SearchOrdersStore>((set) => ({
  ...INITIAL_STATE,

  setOrderNumber: (v) => set({ orderNumber: v }),
  setCustomer: (v) => set({ customer: v }),
  setEmail: (v) => set({ email: v }),
  setStatus: (v) => set({ status: v }),
  setUseExactPrice: (v) => set({ useExactPrice: v }),
  setExactPrice: (v) => set({ exactPrice: v }),
  setPriceRange: (v) => set({ priceRange: v }),
  setDateRange: (v) => set({ dateRange: v }),

  clearOrderNumber: () => set({ orderNumber: "" }),
  clearCustomer: () => set({ customer: "" }),
  clearEmail: () => set({ email: "" }),
  clearStatus: () => set({ status: "all" }),

  clearPrice: () =>
    set({
      useExactPrice: false,
      exactPrice: undefined,
      priceRange: [0, 10000],
    }),

  clearDateRange: () => set({ dateRange: undefined }),

  clearAllFilters: () => set({ ...INITIAL_STATE }),
  reset: () => set({ ...INITIAL_STATE }),
}));
