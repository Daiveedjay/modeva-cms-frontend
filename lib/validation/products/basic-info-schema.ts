import {
  MAX_DESCRIPTION_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
  MIN_PRODUCT_NAME_LENGTH,
} from "@/lib/constants";
import { ProductBase } from "@/lib/store/product/use-product-basic-info-store";

import { z } from "zod";

const compositionFieldSchema = z.object({
  label: z.string().min(1, { message: "Composition label is required" }),
  content: z.string().min(1, { message: "Composition content is required" }),
});

export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(MIN_PRODUCT_NAME_LENGTH, { message: "Product name is required" })
    .max(MAX_PRODUCT_NAME_LENGTH, {
      message: `Product name must be at most ${MAX_PRODUCT_NAME_LENGTH} characters`,
    }),

  description: z.string().max(MAX_DESCRIPTION_LENGTH, {
    message: "Description must be at most 60 characters",
  }),
  // Must be greater than 0
  price: z.number().min(1, {
    message: "Price must be greater than 0",
  }),

  //   Sub category cannot be empty or an empty string
  sub_category_id: z
    .string()
    .min(1, { message: "Sub-category id is required" }),
  //   price:z

  composition: z.array(compositionFieldSchema).optional(),

  tags: z
    .array(z.string().min(1, { message: "Tag cannot be empty" }))
    .optional(),
});

export function validateBasicInfo(data: ProductBase) {
  const result = basicInfoSchema.safeParse(data);

  if (result.success) {
    return { success: true, errors: null };
  }

  // Grab first error message from the Zod error object
  const firstError =
    result.error.issues[0]?.message ?? "Invalid basic info input";

  return {
    success: false,
    errors: { message: firstError },
  };
}
