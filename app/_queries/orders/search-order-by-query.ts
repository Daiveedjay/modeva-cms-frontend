import { apiClient, ApiError } from "@/app/_queries/api-client";

import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Order, OrderSearchParams } from "@/lib/types/order";

import { useQuery, keepPreviousData } from "@tanstack/react-query";



function cleanParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k as keyof T] = v as T[keyof T];
  }
  return out;
}

export async function searchOrders(
  params: OrderSearchParams,
  signal?: AbortSignal,
): Promise<ApiResponse<Order[]>> {
  const resp = await apiClient<Order[], never, OrderSearchParams>(
    `${API_ADMIN_PREFIX}/orders/search`,
    {
      method: "get",
      params: cleanParams({
        page: params.page ?? 1,
        limit: params.limit ?? 10,

        q: params.q,
        order_number: params.order_number,
        customer: params.customer,
        email: params.email,
        status: params.status,

        price: params.price,
        min_price: params.min_price,
        max_price: params.max_price,

        created_from: params.created_from,
        created_to: params.created_to,
      }),
      signal,
    },
  );

  return resp;
}

export function useSearchOrders(params: OrderSearchParams, enabled: boolean) {
  return useQuery<ApiResponse<Order[]>, ApiError>({
    queryKey: ["orders-search", params],
    queryFn: ({ signal }) => searchOrders(params, signal),
    placeholderData: keepPreviousData,
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
