import { ProductInventory, ProductVariant } from "@/lib/types/product";
import { create } from "zustand";



// helper to build combinations
function getCombinations(variants: ProductVariant[]): string[][] {
  if (variants.length === 0) return [];
  return variants.reduce<string[][]>((acc, v) => {
    if (acc.length === 0) return v.options.map((o) => [o]);
    return acc.flatMap((prev) => v.options.map((o) => [...prev, o]));
  }, []);
}

const buildInventory = (
  variants: ProductVariant[],
  prevInventory: ProductInventory = []
): ProductInventory => {
  const valid = variants.filter((v) => v.options.length > 0);
  const combos = getCombinations(valid);
  const prevMap = Object.fromEntries(
    prevInventory.map((i) => [i.variant_name, i.quantity])
  );

  return combos.map((combo) => {
    const variant_name = combo.join("-");
    return {
      combo,
      variant_name,
      quantity: prevMap[variant_name] ?? 0,
    };
  });
};

const defaultVariants: ProductVariant[] = [
  { type: "Size", options: ["S", "M", "L"] },
  { type: "Color", options: ["Black", "White", "Gray"] },
];

interface ProductVariantsState {
  variants: ProductVariant[];
  inventory: ProductInventory;
  setVariants: (variants: ProductVariant[]) => void;
  setInventory: (inventory: ProductInventory) => void;
  setInventoryItem: (variantName: string, qty: number) => void;
  resetVariants: () => void;
}

export const useProductVariantsStore = create<ProductVariantsState>((set) => ({
  variants: defaultVariants,
  inventory: buildInventory(defaultVariants),

  // rebuild inventory dynamically when variants change
  setVariants: (variants) =>
    set((state) => ({
      variants,
      inventory: buildInventory(variants, state.inventory),
    })),

  // ✅ set entire inventory (used when loading product)
  setInventory: (inventory) =>
    set(() => ({
      inventory,
    })),

  // update a single variant quantity
  setInventoryItem: (variant_name, qty) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.variant_name === variant_name ? { ...item, quantity: qty } : item
      ),
    })),

  // reset to defaults
  resetVariants: () =>
    set({
      variants: defaultVariants,
      inventory: buildInventory(defaultVariants),
    }),
}));
