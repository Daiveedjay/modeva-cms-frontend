import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { GeographicData } from "@/lib/types/analytics";
import { useQuery } from "@tanstack/react-query";


export async function getGeographicData(
  signal?: AbortSignal,
): Promise<ApiResponse<GeographicData[]>> {
  const resp = await apiClient<GeographicData[]>(
    `${API_ADMIN_PREFIX}/analytics/geographic-data`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetGeographicData() {
  return useQuery<ApiResponse<GeographicData[]>, ApiError>({
    queryKey: ["analytics-geographic"],
    queryFn: ({ signal }) => getGeographicData(signal),
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
