import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { BanCustomerResponse } from "@/lib/types/customer"; // reusing the same response type
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API call for unbanning a customer
export async function unbanCustomer(
  customerId: string,
  data: { reason: string },
  signal?: AbortSignal,
): Promise<ApiResponse<BanCustomerResponse>> {
  const resp = await apiClient<BanCustomerResponse>(
    `${API_ADMIN_PREFIX}/customers/${customerId}/unban`,
    {
      method: "post",
      withCredentials: true,
      signal,
      data, // send { reason: string } directly
    },
  );
  return resp;
}

// React Query hook for unbanning
export function useUnbanCustomer(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<BanCustomerResponse>,
    ApiError,
    { reason: string } // pass an object with reason
  >({
    mutationFn: (data) => unbanCustomer(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["all-admin-activity"] });
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) return;
      if (error.statusCode === 400) {
        toastError("Validation error", error.message);
      } else if (error.statusCode === 404) {
        toastError("Customer not found", error.message);
      } else if (error.statusCode === 409) {
        toastError("Conflict", error.message);
      } else {
        toastError("Failed to unban customer", error.message);
      }
    },
  });
}
