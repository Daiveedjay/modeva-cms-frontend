import { ProductVariant } from "@/lib/types/product";
import { z } from "zod";

export const variantOptionSchema = z.string().min(1, {
  message: "Option cannot be empty",
});

export const productVariantSchema = z.object({
  type: z.string().min(1, { message: "Variant type is required" }),
  options: z
    .array(variantOptionSchema)
    .min(1, { message: "At least one option is required" }),
});

export const productVariantsSchema = z
  .array(productVariantSchema)
  .min(1, { message: "At least one variant type is required" });

export function validateProductVariants(data: ProductVariant[]) {
  const result = productVariantsSchema.safeParse(data);

  if (result.success) {
    return { success: true, errors: null };
  }

  // Grab first error message from the Zod error object
  const firstError =
    result.error.issues[0]?.message ?? "Invalid product variants input";

  return {
    success: false,
    errors: { message: firstError },
  };
}
