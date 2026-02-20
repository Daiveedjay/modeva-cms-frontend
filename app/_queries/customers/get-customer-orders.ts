import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { CustomerOrder } from "@/lib/types/customer";
import { SharedQueryParams } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export async function getCustomerOrders(
  customer_id: string,
  page = 1,
  limit = 10,
  signal?: AbortSignal,
): Promise<ApiResponse<CustomerOrder[]>> {
  const params: SharedQueryParams = { page, limit };
  const resp = await apiClient<CustomerOrder[], never, SharedQueryParams>(
    `${API_ADMIN_PREFIX}/customers/${customer_id}/orders`,
    {
      method: "get",
      params,
      signal,
    },
  );
  return resp;
}

export function useGetCustomerOrders(
  customer_id: string,
  enabled: { enabled: boolean } = { enabled: true },
  page = 1,
  limit = 10,
) {
  return useQuery<ApiResponse<CustomerOrder[]>, ApiError>({
    queryKey: ["customer-orders", customer_id, page, limit],
    queryFn: ({ signal }) =>
      getCustomerOrders(customer_id, page, limit, signal),
    enabled: enabled.enabled,
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
