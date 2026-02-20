import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { OrderStatsResponse } from "@/lib/types/order";
import { useQuery, keepPreviousData } from "@tanstack/react-query";


export async function getOrdersStats(
  signal?: AbortSignal,
): Promise<ApiResponse<OrderStatsResponse>> {
  const resp = await apiClient<OrderStatsResponse>(
    `${API_ADMIN_PREFIX}/orders/stats`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetOrdersStats() {
  return useQuery<ApiResponse<OrderStatsResponse>, ApiError>({
    queryKey: ["orders", "stats"],
    queryFn: ({ signal }) => getOrdersStats(signal),
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
