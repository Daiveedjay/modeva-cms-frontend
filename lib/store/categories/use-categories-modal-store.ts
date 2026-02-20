import { CategoryModalState } from "@/lib/types";
import { create } from "zustand";

interface CategoryModalStore {
  categoryModal: CategoryModalState | null;
  openCategoryModal: (modal: CategoryModalState) => void;
  closeCategoryModal: () => void;
}

export const useCategoriesModalStore = create<CategoryModalStore>((set) => ({
  categoryModal: null,
  openCategoryModal: (categoryModal) => {
    set({ categoryModal });
  },
  closeCategoryModal: () => {
    set({ categoryModal: null });
  },
}));
