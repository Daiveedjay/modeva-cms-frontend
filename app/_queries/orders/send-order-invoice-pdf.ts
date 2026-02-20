import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { toastError } from "@/lib/utils";

async function sendOrderInvoicePDF(
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<null>> {
  return await apiClient<null>(
    `${API_ADMIN_PREFIX}/orders/${orderId}/send-invoice`,
    {
      method: "post",
      withCredentials: true,
      signal,
    },
  );
}

export function useSendOrderInvoicePDF() {
  return useMutation<ApiResponse<null>, ApiError, string>({
    mutationFn: (orderId: string) => sendOrderInvoicePDF(orderId),
    onError: (error: ApiError) => {
      if (error.isCanceled) {
        return;
      }
      if (error.statusCode === 404) {
        toastError("Order not found", error.message);
      } else if (error.statusCode === 400) {
        toastError("Invalid request", error.message);
      } else {
        toastError("Failed to send invoice email", error.message);
      }
    },
  });
}
