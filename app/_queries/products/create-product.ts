import { ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX, API_ENDPOINT } from "@/lib/constants";
import { Product } from "@/lib/store/product/use-product-manager-store";
import { ApiResponse } from "@/lib/types";
import { ProductInput } from "@/lib/types/product";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "product-images";

/**
 * Upload single image to Cloudinary
 */
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData,
    { timeout: 30000 },
  );

  return response.data.secure_url;
}

/**
 * Delete entire product folder from Cloudinary
 */
async function deleteProductFolder(product_id: string): Promise<void> {
  const folderPath = `modeva/products/${product_id}`;
  console.log(`[Cleanup] Deleting folder: ${folderPath}`);

  try {
    await axios.post(
      `${API_ENDPOINT}/products/cleanup-folder`,
      { folderPath },
      { timeout: 10000 },
    );
    console.log(`[Cleanup] ✓ Folder deleted: ${folderPath}`);
  } catch (error) {
    console.error("[Cleanup] ⚠️  Failed to delete folder:", error);
    // Don't throw — cleanup is best-effort
  }
}

/**
 * Create product — uploads primary + other images in parallel, then saves to backend
 */
async function createProduct(
  product_props: ProductInput,
): Promise<ApiResponse<Product>> {
  const startTime = performance.now();

  if (!product_props.media.primary.file) {
    throw new ApiError("Primary image is required", 400);
  }

  const product_id = crypto.randomUUID();
  const baseFolder = `modeva/products/${product_id}`;

  const otherFiles = product_props.media.other
    .filter((img) => img.file)
    .map((img) => img.file!);

  let imagesUploaded = false;

  try {
    // ═══════════════════════════════════════════════════════
    // STEP 1: Upload primary first — must succeed before anything else
    // ═══════════════════════════════════════════════════════

    const primaryUrl = await uploadToCloudinary(
      product_props.media.primary.file,
      `${baseFolder}/primary`,
    );

    imagesUploaded = true;

    // ═══════════════════════════════════════════════════════
    // STEP 2: Upload other images in parallel
    // ═══════════════════════════════════════════════════════

    const otherUrls =
      otherFiles.length > 0
        ? await Promise.all(
            otherFiles.map((file) =>
              uploadToCloudinary(file, `${baseFolder}/other`),
            ),
          )
        : [];

    const uploadTime = performance.now() - startTime;
    console.log(
      `[Create Product] ✓ All uploads done: ${uploadTime.toFixed(0)}ms`,
    );

    // ═══════════════════════════════════════════════════════
    // STEP 2: Save to backend
    // ═══════════════════════════════════════════════════════

    try {
      const response = await axios.post<ApiResponse<Product>>(
        `${API_ENDPOINT}/${API_ADMIN_PREFIX}/products`,
        {
          name: product_props.name,
          description: product_props.description,
          composition: product_props.composition,
          price: product_props.price,
          sub_category_id: product_props.sub_category_id,
          status: product_props.status,
          tags: product_props.tags,
          variants: product_props.variants,
          inventory: product_props.inventory,
          seo: product_props.seo,
          media: {
            primary: { url: primaryUrl },
            other: otherUrls.map((url, i) => ({ url, order: i })),
          },
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        },
      );

      const totalTime = performance.now() - startTime;
      console.log(`[Create Product] ✓ Total: ${totalTime.toFixed(0)}ms`);

      if (response.data.error) {
        throw new ApiError(
          response.data.message,
          response.status,
          response.data,
        );
      }

      return response.data;
    } catch (backendError) {
      // Backend failed — clean up uploaded images
      console.error(
        "[Create Product] ❌ Backend failed, cleaning up folder...",
      );

      if (imagesUploaded) {
        await deleteProductFolder(product_id);
      }

      if (axios.isAxiosError(backendError)) {
        if (backendError.code === "ERR_CANCELED") {
          throw new ApiError("Request canceled", null, undefined, true);
        }

        if (backendError.response) {
          const resp = backendError.response;
          const payload =
            typeof resp.data === "object" && resp.data !== null
              ? (resp.data as ApiResponse<Product>)
              : undefined;
          const message =
            (payload?.message as string) ?? resp.statusText ?? "Unknown error";
          throw new ApiError(message, resp.status, payload, false);
        }

        if (backendError.request) {
          throw new ApiError(
            "Could not connect to server. Uploaded images have been cleaned up.",
            null,
            undefined,
            false,
          );
        }

        throw new ApiError(backendError.message, null, undefined, false);
      }

      if (backendError instanceof Error) {
        throw new ApiError(backendError.message, null, undefined, false);
      }

      throw new ApiError(String(backendError), null, undefined, false);
    }
  } catch (uploadError) {
    console.error("[Create Product] ❌ Upload failed:", uploadError);

    if (uploadError instanceof ApiError) {
      throw uploadError;
    }

    throw new ApiError("Failed to upload images. Please try again.", 500);
  }
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Product>, ApiError, ProductInput>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
      queryClient.invalidateQueries({ queryKey: ["all-admin-activity"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) return;

      if (error.statusCode === 400) {
        toastError(`Validation error: ${error.message}`);
      } else if (error.statusCode === 409) {
        toastError(`Conflict: ${error.message}`);
      } else {
        toastError(`Could not create product: ${error.message}`);
      }
    },
  });
}
