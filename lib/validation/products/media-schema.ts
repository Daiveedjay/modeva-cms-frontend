import { ProductMedia } from "@/lib/types/product";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const RequiredImageSchema = z.object({
  url: z
    .union([z.url("Invalid Image"), z.instanceof(File)]) // accept File or string
    .refine(
      (val) => {
        if (typeof val === "string") {
          return val.length > 0; // non-empty
        }
        // val is File
        return val.size <= MAX_FILE_SIZE;
      },
      { message: "Image URL is required and must be ≤ 5MB" },
    ),
});

const OptionalImageSchema = z.object({
  url: z
    .union([z.string(), z.instanceof(File)]) // allow empty string or File
    .refine(
      (val) => {
        if (typeof val === "string") {
          return val === "" || z.url().safeParse(val).success;
        }
        return val.size <= MAX_FILE_SIZE;
      },
      { message: "Invalid image or too large" },
    ),
  order: z.number(), // your order field
});

const ProductMediaSchema = z.object({
  primary: RequiredImageSchema,
  other: z
    .array(OptionalImageSchema)
    .optional()
    .refine(
      (imgs) => {
        if (!imgs) return true;
        // ensure each img url/file is valid and size constrained
        return imgs.every((img) => {
          if (typeof img.url === "string") {
            // empty or valid url
            return (
              img.url === "" || z.string().url().safeParse(img.url).success
            );
          } else {
            // File
            return !img.url || (img.url as File).size <= MAX_FILE_SIZE;
          }
        });
      },
      { message: "Each image must be ≤ 5MB" },
    ),
});

// No longer an array of ProductMedia, so drop the .length(1)
export function validateMedia(media: ProductMedia) {
  const result = ProductMediaSchema.safeParse(media);

  if (result.success) {
    return { success: true, errors: null };
  }

  const firstError = result.error.issues[0]?.message ?? "Invalid media input";
  return { success: false, errors: { message: firstError } };
}
