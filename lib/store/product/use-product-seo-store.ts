import { ProductSeo } from "@/lib/types/product";
import { create } from "zustand";


const defaultSeo: ProductSeo = { seo_title: "", seo_description: "" };

interface ProductSeoState {
  seo: ProductSeo;
  setSeo: (seo: Partial<ProductSeo>) => void;
  resetSeo: () => void;
}

export const useProductSeoStore = create<ProductSeoState>((set) => ({
  seo: defaultSeo,
  setSeo: (seo) => set((state) => ({ seo: { ...state.seo, ...seo } })),
  resetSeo: () => set({ seo: defaultSeo }),
}));
