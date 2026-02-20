import { create } from "zustand";

// Import all your slice stores
import {
  ProductBase,
  useProductBasicInfoStore,
} from "./use-product-basic-info-store";
import { useProductMediaStore } from "./use-product-media-store";
import { useProductSeoStore } from "./use-product-seo-store";
import { useProductVariantsStore } from "@/lib/store/product/use-product-variant-store";
import {
  ProductInventory,
  ProductMedia,
  ProductSeo,
  ProductVariant,
} from "@/lib/types/product";

export interface Product {
  basic_info: ProductBase;
  seo: ProductSeo;
  media: ProductMedia;
  variants: ProductVariant[];
  inventory: ProductInventory;
}

interface ProductManagerState {
  resetAllProductStores: () => void;
  loadProductToStore: (product: Product) => void;
}

export const useProductManagerStore = create<ProductManagerState>(() => ({
  // ✅ Reset all product slices to their default state
  resetAllProductStores: () => {
    useProductBasicInfoStore.getState().resetBasicInfo();
    useProductMediaStore.getState().resetMedia();
    useProductVariantsStore.getState().resetVariants();
    useProductSeoStore.getState().resetSeo();
  },

  // ✅ Load a full product object into all relevant stores
  // use-product-manager-store.ts
  loadProductToStore: (product: Product) => {
    const fixedInventory = product.inventory.map((item) => ({
      ...item,
      variant_name: item.variant_name || item.combo.join("-"),
    }));

    // Ensure we always have 3 "other" image slots
    const maxOtherImages = 3;
    const filledOthers = product.media.other ?? [];
    const paddedOthers = [
      ...filledOthers,
      ...Array.from(
        { length: Math.max(0, maxOtherImages - filledOthers.length) },
        (_, i) => ({
          file: null,
          url: "",
          order: filledOthers.length + i + 1,
        }),
      ),
    ];

    useProductBasicInfoStore.getState().setBasicInfo(product.basic_info);
    useProductMediaStore.getState().setMedia({
      primary: product.media.primary,
      other: paddedOthers,
    });
    useProductVariantsStore.getState().setVariants(product.variants);
    useProductVariantsStore.getState().setInventory(fixedInventory);
    useProductSeoStore.getState().setSeo(product.seo);
  },
}));
