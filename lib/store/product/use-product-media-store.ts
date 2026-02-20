
// use-product-media-store.ts
import { ProductMedia } from "@/lib/types/product";
import { create } from "zustand";


const defaultMedia: ProductMedia = {
  primary: { file: null, url: "" },
  other: Array.from({ length: 3 }, (_, i) => ({
    file: null,
    url: "",
    order: i + 1,
  })),
};

interface ProductMediaState {
  media: ProductMedia;
  setMedia: (media: ProductMedia) => void;
  setPrimaryFile: (file: File | null) => void;
  setOtherFile: (file: File | null, index: number) => void;
  resetMedia: () => void;
}

export const useProductMediaStore = create<ProductMediaState>((set) => ({
  media: defaultMedia,

  setMedia: (media) => set({ media }),

  setPrimaryFile: (file) =>
    set((state) => ({
      media: {
        ...state.media,
        primary: {
          file,
          url: file ? URL.createObjectURL(file) : "",
        },
      },
    })),

  setOtherFile: (file, index) =>
    set((state) => {
      const updated = [...state.media.other];
      updated[index] = {
        ...updated[index],
        file,
        url: file ? URL.createObjectURL(file) : "",
      };
      return { media: { ...state.media, other: updated } };
    }),

  resetMedia: () => set({ media: defaultMedia }),
}));
