// src/lib/schema.ts

import { z } from "zod";

import {
  MAX_CATEGORY_NAME_LENGTH,
  MIN_CATEGORY_NAME_LENGTH,
} from "@/lib/constants";
import { Category } from "@/lib/types/category";

/**
 * the shape of the data we validate
 */
export type BaseCategoryInput = {
  name: string;
  description: string;
};

/**
 * Zod schema for name + description constraints
 */
export const baseCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(MIN_CATEGORY_NAME_LENGTH, {
      message: `Name must be at least ${MIN_CATEGORY_NAME_LENGTH} characters long.`,
    }),
  description: z.string().max(MAX_CATEGORY_NAME_LENGTH, {
    message: `Description cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters.`,
  }),
});

/**
 * inferred type from baseCategorySchema
 */
export type BaseCategory = z.infer<typeof baseCategorySchema>;

/**
 * validate a top-level category:
 *  • shape + length via baseCategorySchema
 *  • unique against parentCategories
 *
 * @returns null if valid, or first error message
 */
export function validateCategory(
  input: BaseCategoryInput,
  parentCategories: Category[],
): string | null {
  const parsed = baseCategorySchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  const isDuplicate = parentCategories.some(
    (cat) => cat.name.toLowerCase() === input.name.toLowerCase(),
  );
  if (isDuplicate) {
    return "Category with this name already exists.";
  }

  return null;
}

/**
 * validate a sub-category under a given parent:
 *  • shape + length via baseCategorySchema
 *  • unique against existing subCategories for that parent
 *
 * @param input         the new sub-category data
 * @param subCategories the array of already-existing subCategories
 * @returns null if valid, or first error message
 */
export function validateSubCategory(
  input: BaseCategoryInput,
  subCategories: Category[],
): string | null {
  const parsed = baseCategorySchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  const isDuplicate = subCategories.some(
    (cat) => cat.name.toLowerCase() === input.name.toLowerCase(),
  );
  if (isDuplicate) {
    return "Subcategory with this name already exists.";
  }

  return null;
}
