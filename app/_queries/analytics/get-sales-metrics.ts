import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { SalesMetrics } from "@/lib/types/analytics";
import { useQuery } from "@tanstack/react-query";


export async function fetchSalesMetrics(
  signal?: AbortSignal,
): Promise<ApiResponse<SalesMetrics>> {
  const resp = await apiClient<SalesMetrics>(
    `${API_ADMIN_PREFIX}/analytics/sales-metrics`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetSalesMetrics() {
  return useQuery<ApiResponse<SalesMetrics>, ApiError>({
    queryKey: ["analytics-sales-metrics"],
    queryFn: ({ signal }) => fetchSalesMetrics(signal),
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
