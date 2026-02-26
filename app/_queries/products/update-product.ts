import { apiClient, ApiError } from "@/app/_queries/api-client";
import { ProductInput, ProductMedia } from "@/lib/types/product";
import { Product } from "@/lib/store/product/use-product-manager-store";

import { ApiResponse } from "@/lib/types";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINT, API_ADMIN_PREFIX } from "@/lib/constants";

/**
 * Check if media has any file changes (new uploads)
 */
function hasMediaChanges(media: ProductMedia): boolean {
  if (media.primary.file) return true;
  return media.other.some((img) => img.file);
}

/**
 * Update product with text-only changes (no images)
 * Uses JSON format for faster updates
 */
async function updateProductTextOnly(
  productId: string,
  productData: ProductInput,
  signal?: AbortSignal,
): Promise<ApiResponse<Product>> {
  const resp = await apiClient<Product, ProductInput>(
    `${API_ADMIN_PREFIX}/products/${productId}`,
    {
      method: "patch",
      data: productData,
      withCredentials: true,
      signal,
    },
  );
  return resp;
}

/**
 * Update product with image changes
 * Uses FormData for multipart upload
 */
async function updateProductWithImages(
  productId: string,
  productData: ProductInput,
  signal?: AbortSignal,
): Promise<ApiResponse<Product>> {
  const formData = new FormData();

  // Add basic text fields
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price.toString());
  formData.append("subCategoryId", productData.sub_category_id);
  formData.append("status", productData.status);

  // Add JSON fields as strings
  formData.append("composition", JSON.stringify(productData.composition));
  formData.append("tags", JSON.stringify(productData.tags));
  formData.append("variants", JSON.stringify(productData.variants));
  formData.append("inventory", JSON.stringify(productData.inventory));
  formData.append("seo", JSON.stringify(productData.seo));

  // Handle primary image
  if (productData.media.primary.file) {
    // New file - will replace old image
    formData.append("primaryImage", productData.media.primary.file);
  } else if (productData.media.primary.url) {
    // Keep existing image
    formData.append("primaryImageUrl", productData.media.primary.url);
  }

  // Handle other images
  // First, collect existing images to keep (images with URL but no file)
  const existingOtherImages = productData.media.other
    .filter((img) => !img.file && img.url)
    .map(({ url, order }) => ({ url, order }));

  if (existingOtherImages.length > 0) {
    formData.append("existingOtherImages", JSON.stringify(existingOtherImages));
  }

  // Add new image files
  productData.media.other.forEach((img) => {
    if (img.file) {
      formData.append("otherImages", img.file);
    }
  });

  // Use axios directly for FormData upload
  try {
    const response = await axios.patch<ApiResponse<Product>>(
      `${API_ENDPOINT}/${API_ADMIN_PREFIX}/products/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds for file upload
        withCredentials: true,
        signal,
      },
    );

    const respData = response.data;

    if (respData.error) {
      throw new ApiError(respData.message, response.status, respData, false);
    }

    return respData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err;

      if (axiosErr.code === "ERR_CANCELED") {
        throw new ApiError("Request canceled", null, undefined, true);
      }

      if (axiosErr.response) {
        const resp = axiosErr.response;
        let payload: ApiResponse<unknown> | undefined;
        if (typeof resp.data === "object" && resp.data !== null) {
          payload = resp.data as ApiResponse<Product>;
        }
        const message =
          (payload?.message as string) ?? resp.statusText ?? "Unknown error";
        throw new ApiError(message, resp.status, payload, false);
      }

      if (axiosErr.request) {
        throw new ApiError("No response from server", null, undefined, false);
      }

      throw new ApiError(axiosErr.message, null, undefined, false);
    }

    if (err instanceof Error) {
      throw new ApiError(err.message, null, undefined, false);
    }

    throw new ApiError(String(err), null, undefined, false);
  }
}

/**
 * Smart update function that automatically chooses the right method
 */
export async function updateProduct(
  productId: string,
  productData: ProductInput,
  signal?: AbortSignal,
): Promise<ApiResponse<Product>> {
  const hasImages = hasMediaChanges(productData.media);

  if (hasImages) {
    // Use FormData for image updates
    return updateProductWithImages(productId, productData, signal);
  } else {
    // Use JSON for text-only updates (faster, no Cloudinary operations)
    return updateProductTextOnly(productId, productData, signal);
  }
}

// Mutation hook to update a product
export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Product>, ApiError, ProductInput>({
    mutationFn: (productData) => updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-activity"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-admin-activity"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) {
        return;
      }
      if (error.statusCode === 400) {
        toastError(`Validation error: ${error.message}`);
      } else if (error.statusCode === 409) {
        toastError(`Conflict: ${error.message}`);
      } else {
        toastError(`Could not update product: ${error.message}`);
      }
    },
  });
}
