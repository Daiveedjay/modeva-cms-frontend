import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { CategoryStats } from "@/lib/types/category";
import { useQuery, keepPreviousData } from "@tanstack/react-query";


export async function getCategoriesStats(
  signal?: AbortSignal
): Promise<ApiResponse<CategoryStats>> {
  const resp = await apiClient<CategoryStats>(
    `${API_ADMIN_PREFIX}/categories/stats`,
    {
      method: "get",
      signal,
    }
  );
  return resp;
}

export function useGetCategoriesStats() {
  return useQuery<ApiResponse<CategoryStats>, ApiError>({
    queryKey: ["categories", "stats"],
    queryFn: ({ signal }) => getCategoriesStats(signal),
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
