import { ProductModalState } from "@/lib/types";
import { create } from "zustand";

interface ProductModalStore {
  productModal: ProductModalState | null;
  openProductModal: (product: ProductModalState) => void;
  closeProductModal: () => void;
}

export const useProductModalStore = create<ProductModalStore>((set) => ({
  productModal: null,
  openProductModal: (productModal) => {
    set({ productModal });
  },
  closeProductModal: () => set({ productModal: null }),
}));
