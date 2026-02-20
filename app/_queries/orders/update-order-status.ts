import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { OrderStatusRequest, OrderStatusResponse } from "@/lib/types/order";
import {  toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export async function updateOrderStatus(
  orderId: string,
  orderStatusProps: OrderStatusRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<OrderStatusResponse>> {
  const resp = await apiClient<OrderStatusResponse, OrderStatusRequest>(
    `${API_ADMIN_PREFIX}/orders/${orderId}/status`,
    {
      method: "patch",
      signal,
      withCredentials: true,
      data: orderStatusProps,
    },
  );
  return resp;
}

export function useUpdateOrderStatus(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<OrderStatusResponse>,
    ApiError,
    OrderStatusRequest
  >({
    mutationFn: (orderStatusProps) =>
      updateOrderStatus(orderId, orderStatusProps),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-activity"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-admin-activity"],
      });
    },

    onError: (error: ApiError) => {
      if (error.isCanceled) {
        // maybe ignore if canceled
        return;
      }
      if (error.statusCode === 400) {
        // validation error
        toastError(`Validation error: ${error.message}`);
      } else if (error.statusCode === 409) {
        // conflict, e.g. duplicate name
        toastError(`Conflict: ${error.message}`);
      } else {
        // generic error
        toastError(`Could not update category status: ${error.message}`);
      }
    },
  });
}
