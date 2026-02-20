import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { Product } from "@/lib/store/product/use-product-manager-store";

import { ApiResponse } from "@/lib/types";
import { SearchProductsParams } from "@/lib/types/product";
import { useQuery, keepPreviousData } from "@tanstack/react-query";


async function searchProducts(
  page = 1,
  limit = 10,
  query: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Product[]>> {
  const params: SearchProductsParams = { page, limit, query };

  const resp = await apiClient<Product[], undefined, SearchProductsParams>(
    `${API_ADMIN_PREFIX}/products/search`,
    {
      method: "get",
      params,
      signal,
    },
  );

  return resp;
}

export function useSearchProducts(query: string, page = 1, limit = 10) {
  return useQuery<ApiResponse<Product[]>, ApiError>({
    queryKey: ["products", "search", query, page, limit],
    queryFn: ({ signal }) => searchProducts(page, limit, query, signal),
    enabled: !!query, // only run when query is not empty
    placeholderData: keepPreviousData,
  });
}
