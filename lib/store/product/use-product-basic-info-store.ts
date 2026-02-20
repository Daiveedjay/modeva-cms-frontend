import { create } from "zustand";

export type ProductStatus = "Active" | "Draft";

export interface ProductBase {
  name: string;
  id: string;
  description: string;
  composition: { label: string; content: string }[];
  price: number;
  sub_category_id: string;
  sub_category_name: string;
  status: ProductStatus;
  tags: string[];
  created_at: Date | string;
  updated_at: Date | string;
  sub_category_path?: string;
}

const defaultBasicInfo: ProductBase = {
  name: "",
  id: "",
  description: "",
  composition: [{ label: "Style", content: "Casual" }],
  price: 0,
  sub_category_id: "",
  sub_category_name: "",
  status: "Draft",
  tags: [],
  created_at: new Date(),
  updated_at: new Date(),
  sub_category_path: "",
};

interface ProductBasicInfoState {
  basic_info: ProductBase;
  setBasicInfo: (info: Partial<ProductBase>) => void;
  resetBasicInfo: () => void;
}

export const useProductBasicInfoStore = create<ProductBasicInfoState>(
  (set) => ({
    basic_info: defaultBasicInfo,
    setBasicInfo: (info) =>
      set((state) => ({ basic_info: { ...state.basic_info, ...info } })),
    resetBasicInfo: () => set({ basic_info: defaultBasicInfo }),
  })
);
