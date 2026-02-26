import { ProductSeo } from "@/lib/types/product";
import z from "zod";

const seoFieldSchema = z.object({
  seo_title: z.string().min(1, { message: "SEO title is required" }),
  seo_description: z
    .string()
    .min(1, { message: "SEO description is required" }),
});
export function validateSeo(data: ProductSeo) {
  const result = seoFieldSchema.safeParse(data);

  if (result.success) {
    return { success: true, errors: null };
  }

  // Grab first error message from the Zod error object
  const firstError = result.error.issues[0]?.message ?? "Invalid SEO input";

  return {
    success: false,
    errors: { message: firstError },
  };
}
