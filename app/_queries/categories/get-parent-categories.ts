import { apiClient, ApiError } from "@/app/_queries/api-client";
import { ApiResponse } from "@/lib/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types/category";
import { API_ADMIN_PREFIX } from "@/lib/constants";

export async function getParentCategories(
  signal?: AbortSignal,
): Promise<ApiResponse<Category[]>> {
  const resp = await apiClient<Category[]>(
    `${API_ADMIN_PREFIX}/categories/parents`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetParentCategories({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery<ApiResponse<Category[]>, ApiError>({
    queryKey: ["parent-categories"],
    queryFn: ({ signal }) => getParentCategories(signal),
    enabled,
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
