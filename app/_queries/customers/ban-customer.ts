import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { BanCustomerRequest, BanCustomerResponse } from "@/lib/types/customer";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function banCustomer(
  customerId: string,
  data: BanCustomerRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<BanCustomerResponse>> {
  const resp = await apiClient<BanCustomerResponse, BanCustomerRequest>(
    `${API_ADMIN_PREFIX}/customers/${customerId}/ban`,
    {
      method: "post",
      withCredentials: true,
      signal,
      data,
    },
  );
  return resp;
}

export function useBanCustomer(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<BanCustomerResponse>,
    ApiError,
    BanCustomerRequest
  >({
    mutationFn: (data) => banCustomer(customerId, data),
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
        toastError("Failed to ban customer", error.message);
      }
    },
  });
}
