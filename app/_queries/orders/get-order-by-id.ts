import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { OrderDetails } from "@/lib/types/order";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export async function getOrderById(
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<OrderDetails>> {
  const resp = await apiClient<OrderDetails, never>(
    `${API_ADMIN_PREFIX}/orders/${orderId}`,
    {
      method: "get",
      signal,
    },
  );
  return resp;
}

export function useGetOrderById(
  orderId: string,
  enabled: { enabled: boolean },
) {
  return useQuery<ApiResponse<OrderDetails>, ApiError>({
    queryKey: ["order", orderId],
    enabled: enabled.enabled || !!orderId,
    queryFn: ({ signal }) => getOrderById(orderId, signal),
    placeholderData: keepPreviousData,
    // meta: { showGlobalError: true },
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
