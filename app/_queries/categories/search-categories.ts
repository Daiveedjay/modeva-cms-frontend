import { apiClient, ApiError } from "@/app/_queries/api-client";

import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Category, SearchCategoriesParams } from "@/lib/types/category";
import { useQuery, keepPreviousData } from "@tanstack/react-query";


async function searchCategories(
  page = 1,
  limit = 10,
  query: string,
  signal?: AbortSignal
): Promise<ApiResponse<Category[]>> {
  const params: SearchCategoriesParams = { page, limit, query };

  const resp = await apiClient<Category[], never, SearchCategoriesParams>(
    `${API_ADMIN_PREFIX}/categories/search`,
    {
      method: "get",
      params,
      signal,
    }
  );
  return resp;
}

export function useSearchCategories(query: string, page = 1, limit = 10) {
  return useQuery<ApiResponse<Category[]>, ApiError>({
    queryKey: ["categories", "search", query, page, limit],
    queryFn: ({ signal }) => searchCategories(page, limit, query, signal),
    enabled: !!query, // don’t run when query is empty
    placeholderData: keepPreviousData,
  });
}
