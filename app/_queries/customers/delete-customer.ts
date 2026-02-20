import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";

import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteCustomerRequest {
  reason: string;
}

interface DeleteCustomerResponse {
  id: string;
  name: string;
  deleted_at: string;
  deletion_reason: string;
}

export async function deleteCustomer(
  customerId: string,
  data: DeleteCustomerRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<DeleteCustomerResponse>> {
  const resp = await apiClient<DeleteCustomerResponse, DeleteCustomerRequest>(
    `${API_ADMIN_PREFIX}/customers/${customerId}`,
    {
      method: "delete",
      signal,
      data,
    },
  );
  return resp;
}

export function useDeleteCustomer(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DeleteCustomerResponse>,
    ApiError,
    DeleteCustomerRequest
  >({
    mutationFn: (data) => deleteCustomer(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
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
        toastError("Failed to delete customer", error.message);
      }
    },
  });
}
