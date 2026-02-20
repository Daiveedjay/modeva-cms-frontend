import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { AnalyticsOverview } from "@/lib/types/analytics";
import { useQuery } from "@tanstack/react-query";



export async function fetchAnalyticsOverview(
  signal?: AbortSignal,
): Promise<ApiResponse<AnalyticsOverview>> {
  const resp = await apiClient<AnalyticsOverview>(
    `${API_ADMIN_PREFIX}/analytics/overview`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetAnalyticsOverview() {
  return useQuery<ApiResponse<AnalyticsOverview>, ApiError>({
    queryKey: ["analytics-overview"],
    queryFn: ({ signal }) => fetchAnalyticsOverview(signal),
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
