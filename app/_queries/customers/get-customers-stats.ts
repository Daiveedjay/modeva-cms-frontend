import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { CustomerStats } from "@/lib/types/customer";
import { useQuery } from "@tanstack/react-query";



export async function getCustomersStats(
  signal?: AbortSignal,
): Promise<ApiResponse<CustomerStats>> {
  const resp = await apiClient<CustomerStats>(
    `${API_ADMIN_PREFIX}/customers/stats`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetCustomersStats() {
  return useQuery<ApiResponse<CustomerStats>, ApiError>({
    queryKey: ["customer-stats"],
    queryFn: ({ signal }) => getCustomersStats(signal),
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
