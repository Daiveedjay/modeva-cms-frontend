import { OrderModalState } from "@/lib/types";
import { create } from "zustand";

interface OrdersModalStore {
  orderModal: OrderModalState | null;
  openOrderModal: (order: OrderModalState) => void;
  closeOrderModal: () => void;
}

export const useOrderModalStore = create<OrdersModalStore>((set) => ({
  orderModal: null,
  openOrderModal: (orderModal) => {
    set({ orderModal });
  },
  closeOrderModal: () => set({ orderModal: null }),
}));
