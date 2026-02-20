import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Order } from "@/lib/types/order";
import { SharedQueryParams } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export async function getOrders(
  page = 1,
  limit = 10,
  signal?: AbortSignal,
): Promise<ApiResponse<Order[]>> {
  const params: SharedQueryParams = { page, limit };
  const resp = await apiClient<Order[], never, SharedQueryParams>(
    `${API_ADMIN_PREFIX}/orders`,
    {
      method: "get",
      params,
      signal,
    },
  );
  return resp;
}

export function useGetOrders(page = 1, limit = 10) {
  return useQuery<ApiResponse<Order[]>, ApiError>({
    queryKey: ["orders", page, limit],
    queryFn: ({ signal }) => getOrders(page, limit, signal),
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
