// src/lib/category-schema.ts

import { z } from "zod";
import {
  MIN_CATEGORY_NAME_LENGTH,
  MAX_CATEGORY_NAME_LENGTH,
  MAX_CATEGORY_DESCRIPTION_LENGTH,
} from "@/lib/constants";
import { Category } from "@/lib/types/category";

/**
 * payload for updating a category:
 * • name only if changed
 * • description only if changed
 */
export type UpdateCategoryInput = {
  name?: string;
  description?: string;
};

/**
 * Zod schema for any updated fields
 *  • name: trimmed, between min & max
 *  • description: trimmed, between 3 & max
 *  • at least one of name/description must be present
 */
const updateCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(MIN_CATEGORY_NAME_LENGTH, {
        message: `Name must be at least ${MIN_CATEGORY_NAME_LENGTH} characters long.`,
      })
      .max(MAX_CATEGORY_NAME_LENGTH, {
        message: `Name cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters.`,
      })
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, {
        message: "Description must be at least 3 characters long.",
      })
      .max(MAX_CATEGORY_DESCRIPTION_LENGTH, {
        message: `Description cannot exceed ${MAX_CATEGORY_DESCRIPTION_LENGTH} characters.`,
      })
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "You haven't made any changes.",
  });

/**
 * runs the update schema, then:
 *  • if a new name was provided, ensures no other category (excluding the one being edited)
 *    bears the same name (case-insensitive)
 *
 * @param payload         the changed fields
 * @param allCategories flat list of all categories
 * @param id            the id of the category being edited
 * @returns null if valid, or the first error message
 */
export function validateUpdateCategory(
  payload: UpdateCategoryInput,
  allCategories: Category[],
  id: string,
): string | null {
  const parsed = updateCategorySchema.safeParse(payload);
  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  // only check uniqueness if name was changed
  if (parsed.data.name) {
    const duplicate = allCategories.some(
      (cat) =>
        cat.id !== id &&
        cat.name.toLowerCase() === parsed.data.name!.toLowerCase(),
    );
    if (duplicate) {
      return "Category with this name already exists.";
    }
  }

  return null;
}

/**
 * payload shape for updating a sub-category
 */
export type UpdateSubCategoryInput = {
  name?: string;
  description?: string;
  parentId?: string | null;
};

const updateSubCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(MIN_CATEGORY_NAME_LENGTH, {
        message: `Name must be at least ${MIN_CATEGORY_NAME_LENGTH} characters long.`,
      })
      .max(MAX_CATEGORY_NAME_LENGTH, {
        message: `Name cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters.`,
      })
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, {
        message: "Description must be at least 3 characters long.",
      })
      .max(MAX_CATEGORY_DESCRIPTION_LENGTH, {
        message: `Description cannot exceed ${MAX_CATEGORY_DESCRIPTION_LENGTH} characters.`,
      })
      .optional(),
    parentId: z.string().nullable().optional(),
  })
  // require at least one field to actually change
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.parentId !== undefined,
    { message: "You haven't made any changes." },
  );

/**
 * validate sub-category update:
 *  • runs the Zod length/format checks (only on the keys you passed)
 *  • ensures at least one of name/description/parent was provided
 *  • if `name` was changed, checks no sibling (same parentId, different id)
 *    already has that exact name (case-insensitive)
 *
 * @param input   only the fields you want to change
 * @param allCats a flat list of every category
 * @param id      the id of the sub-category being edited
 * @returns       null if OK, otherwise the first Zod or uniqueness error
 */
export function validateUpdateSubCategory(
  input: UpdateSubCategoryInput,
  allCats: Category[],
  id: string,
): string | null {
  const parsed = updateSubCategorySchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  // figure out which parentId to check under
  const newParent = parsed.data.parentId;
  const original = allCats.find((c) => c.id === id);
  const parentId =
    newParent !== undefined ? newParent : original?.parent_id || null;

  // collect siblings (excluding self)
  const siblings = allCats.filter(
    (c) => c.parent_id === parentId && c.id !== id,
  );

  // only enforce name-uniqueness if they provided a new name
  if (parsed.data.name) {
    const duplicate = siblings.some(
      (s) => s.name.toLowerCase() === parsed.data.name!.toLowerCase(),
    );
    if (duplicate) {
      return "Sub-category with this name already exists.";
    }
  }

  return null;
}
