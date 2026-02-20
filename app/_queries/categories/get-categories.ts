import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Category } from "@/lib/types/category";
import { SharedQueryParams } from "@/lib/utils";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export async function getCategories(
  page = 1,
  limit = 10,
  signal?: AbortSignal,
): Promise<ApiResponse<Category[]>> {
  const params: SharedQueryParams = { page, limit };

  const resp = await apiClient<Category[], never, SharedQueryParams>(
    `${API_ADMIN_PREFIX}/categories`,
    {
      method: "get",
      params,
      signal,
    },
  );
  return resp;
}

export function useGetCategories(page = 1, limit = 10) {
  return useQuery<ApiResponse<Category[]>, ApiError>({
    queryKey: ["categories", page, limit],
    queryFn: ({ signal }) => getCategories(page, limit, signal),
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
