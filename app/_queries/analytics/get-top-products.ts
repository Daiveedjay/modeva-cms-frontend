import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { TopProduct } from "@/lib/types/analytics";
import { useQuery } from "@tanstack/react-query";


export async function getTopProducts(
  signal?: AbortSignal,
): Promise<ApiResponse<TopProduct[]>> {
  const resp = await apiClient<TopProduct[]>(
    `${API_ADMIN_PREFIX}/analytics/top-products`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetTopProducts() {
  return useQuery<ApiResponse<TopProduct[]>, ApiError>({
    queryKey: ["analytics-top-products"],
    queryFn: ({ signal }) => getTopProducts(signal),
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
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
