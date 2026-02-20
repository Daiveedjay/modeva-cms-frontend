import { CustomerModalState } from "@/lib/types";
import { create } from "zustand";

interface CustomerModalStore {
  customerModal: CustomerModalState | null;
  openCustomerModal: (customerModal: CustomerModalState) => void;
  closeCustomerModal: () => void;
}

export const useCustomerModalStore = create<CustomerModalStore>((set) => ({
  customerModal: null,
  openCustomerModal: (customerModal) => {
    set({ customerModal });
  },
  closeCustomerModal: () => {
    set({ customerModal: null });
  },
}));
