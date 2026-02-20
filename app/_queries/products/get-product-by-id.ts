import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { Product } from "@/lib/store/product/use-product-manager-store";
import { ApiResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export async function getProductById(
  productId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Product>> {
  const resp = await apiClient<Product>(
    `${API_ADMIN_PREFIX}/products/${productId}`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetProductById(productId: string | null, enabled = false) {
  return useQuery<ApiResponse<Product>, ApiError>({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => getProductById(productId!, signal),
    enabled: enabled && !!productId, // Only fetch if enabled AND productId exists
    retry: (failureCount, error) => {
      if (error.isCanceled) return false;
      if (
        error.statusCode &&
        error.statusCode >= 400 &&
        error.statusCode < 500
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
