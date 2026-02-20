import { Product } from "@/lib/store/product/use-product-manager-store";
import { validateBasicInfo } from "@/lib/validation/products/basic-info-schema";
import { validateMedia } from "@/lib/validation/products/media-schema";
import { validateSeo } from "@/lib/validation/products/seo-schema";
import { validateProductVariants } from "@/lib/validation/products/variants-schema";

type TabsValue = "media" | "basic-info" | "variants" | "seo";

interface TabValidationResult {
  success: boolean;
  errors: { message: string; tab: TabsValue } | null;
}

export function validateAllTabs(
  state: Omit<Product, "id" | "stock" | "inventory">
): TabValidationResult {
  const { basic_info, media, variants, seo } = state;

  const validations = [
    { tab: "media", result: validateMedia(media) },
    { tab: "basic-info", result: validateBasicInfo(basic_info) },
    { tab: "variants", result: validateProductVariants(variants) },
    { tab: "seo", result: validateSeo(seo) },
  ];

  for (const { tab, result } of validations) {
    if (!result.success) {
      return {
        success: false,
        //   Type of tabs
        errors: {
          message: result.errors?.message || "Validation failed",
          tab,
        } as { message: string; tab: TabsValue },
      };
    }
  }

  return { success: true, errors: null };
}
