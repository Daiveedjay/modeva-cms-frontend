import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { SubCategoryResponse } from "@/lib/types/category";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export async function getSubCategories(
  signal?: AbortSignal,
): Promise<ApiResponse<SubCategoryResponse[]>> {
  const resp = await apiClient<SubCategoryResponse[]>(
    `${API_ADMIN_PREFIX}/categories/children`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetSubCategories({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery<ApiResponse<SubCategoryResponse[]>, ApiError>({
    queryKey: ["sub-categories"],
    queryFn: ({ signal }) => getSubCategories(signal),
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
