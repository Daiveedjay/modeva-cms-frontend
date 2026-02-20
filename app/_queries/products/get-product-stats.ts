import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { ProductStats } from "@/lib/types/product";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// Define the ProductStats type (based on your Go controller response)

// Fetch function
export async function getProductsStats(
  signal?: AbortSignal
): Promise<ApiResponse<ProductStats[]>> {
  const resp = await apiClient<ProductStats[]>(
    `${API_ADMIN_PREFIX}/products/stats`,
    {
      method: "get",
      signal,
    }
  );
  return resp;
}

// React Query hook
export function useGetProductsStats() {
  return useQuery<ApiResponse<ProductStats[]>, ApiError>({
    queryKey: ["products", "stats"],
    queryFn: ({ signal }) => getProductsStats(signal),
    placeholderData: keepPreviousData,
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
