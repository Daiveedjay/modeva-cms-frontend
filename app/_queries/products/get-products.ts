import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { Product } from "@/lib/store/product/use-product-manager-store";
import { ApiResponse } from "@/lib/types";
import { SharedQueryParams } from "@/lib/utils";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export async function getProducts(
  page = 1,
  limit = 10,
  signal?: AbortSignal,
): Promise<ApiResponse<Product[]>> {
  const params: SharedQueryParams = { page, limit };
  const resp = await apiClient<Product[], undefined, SharedQueryParams>(
    `${API_ADMIN_PREFIX}/products`,
    {
      method: "get",
      params,
      signal,
    },
  );
  return resp;
}
export function useGetProducts(page = 1, limit = 10) {
  return useQuery<ApiResponse<Product[]>, ApiError>({
    queryKey: ["products", page, limit],
    queryFn: ({ signal }) => getProducts(page, limit, signal),
    placeholderData: keepPreviousData,
    meta: { showGlobalError: true },
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
