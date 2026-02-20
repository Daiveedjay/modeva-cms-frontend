import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { MonthlyRevenueData } from "@/lib/types/analytics";
import { useQuery } from "@tanstack/react-query";



export async function fetchMonthlyRevenue(
  signal?: AbortSignal,
): Promise<ApiResponse<MonthlyRevenueData[]>> {
  const resp = await apiClient<MonthlyRevenueData[]>(
    `${API_ADMIN_PREFIX}/analytics/monthly-revenue`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetMonthlyRevenue() {
  return useQuery<ApiResponse<MonthlyRevenueData[]>, ApiError>({
    queryKey: ["analytics-monthly-revenue"],
    queryFn: ({ signal }) => fetchMonthlyRevenue(signal),
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
