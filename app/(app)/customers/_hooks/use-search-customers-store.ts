import { create } from "zustand";

export interface SearchCustomersStore {
  // Text filters
  name: string;
  email: string;
  country: string;

  // Status filter
  status: "active" | "suspended" | "banned" | "deleted" | "all";

  // Date filters
  useDateRange: boolean;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  exactJoinedDate?: Date;

  // Spending filters
  useExactSpending: boolean;
  exactSpending: number;
  spendingRange: [number, number]; // [min, max]

  // Actions
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setCountry: (country: string) => void;
  setStatus: (status: SearchCustomersStore["status"]) => void;
  setUseDateRange: (useRange: boolean) => void;
  setDateRange: (from?: Date, to?: Date) => void;
  setExactJoinedDate: (date?: Date) => void;
  setUseExactSpending: (useExact: boolean) => void;
  setExactSpending: (amount: number) => void;
  setSpendingRange: (min: number, max: number) => void;
  reset: () => void;
}

const initialState = {
  name: "",
  email: "",
  country: "",
  status: "all" as const,
  useDateRange: true,
  dateRange: { from: undefined, to: undefined },
  exactJoinedDate: undefined,
  useExactSpending: false,
  exactSpending: 0,
  spendingRange: [0, 10000000] as [number, number],
};

export const useSearchCustomersStore = create<SearchCustomersStore>((set) => ({
  ...initialState,

  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setCountry: (country) => set({ country }),
  setStatus: (status) => set({ status }),
  setUseDateRange: (useDateRange) => set({ useDateRange }),
  setDateRange: (from, to) => set({ dateRange: { from, to } }),
  setExactJoinedDate: (exactJoinedDate) => set({ exactJoinedDate }),
  setUseExactSpending: (useExact) => set({ useExactSpending: useExact }),
  setExactSpending: (amount) => set({ exactSpending: amount }),
  setSpendingRange: (min, max) => set({ spendingRange: [min, max] }),
  reset: () => set(initialState),
}));
