import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Category } from "@/lib/types/category";
import { useQuery } from "@tanstack/react-query";

export async function getCategoryById(
  category_id: string,
  signal?: AbortSignal
): Promise<ApiResponse<Category>> {
  const resp = await apiClient<Category>(
    `${API_ADMIN_PREFIX}/categories/${category_id}`,
    {
      method: "get",
      signal,
    }
  );
  return resp;
}

export function useGetCategoryById(category_id: string, enabled = false) {
  return useQuery<ApiResponse<Category>, ApiError>({
    queryKey: ["category", category_id],
    queryFn: ({ signal }) => getCategoryById(category_id, signal),
    enabled,
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
