import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { DeviceAnalytics } from "@/lib/types/analytics";
import { useQuery } from "@tanstack/react-query";



export async function fetchDeviceAnalytics(
  signal?: AbortSignal,
): Promise<ApiResponse<DeviceAnalytics[]>> {
  const resp = await apiClient<DeviceAnalytics[]>(
    `${API_ADMIN_PREFIX}/analytics/device-analytics`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetDeviceAnalytics() {
  return useQuery<ApiResponse<DeviceAnalytics[]>, ApiError>({
    queryKey: ["analytics-devices"],
    queryFn: ({ signal }) => fetchDeviceAnalytics(signal),
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
