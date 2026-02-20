import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { SendEmailRequest, SendEmailResponse } from "@/lib/types/customer";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function sendCustomerEmail(
  customerId: string,
  emailData: SendEmailRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<SendEmailResponse>> {
  const resp = await apiClient<SendEmailResponse, SendEmailRequest>(
    `${API_ADMIN_PREFIX}/customers/${customerId}/send-email`,
    {
      method: "post",
      signal,
      withCredentials: true,
      data: emailData,
    },
  );
  return resp;
}

export function useSendCustomerEmail(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SendEmailResponse>,
    ApiError,
    SendEmailRequest
  >({
    mutationFn: (emailData) => sendCustomerEmail(customerId, emailData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
      queryClient.invalidateQueries({ queryKey: ["all-admin-activity"] });
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) {
        return;
      }
      if (error.statusCode === 400) {
        toastError("Validation error", error.message);
      } else if (error.statusCode === 404) {
        toastError("Customer not found", error.message);
      } else {
        toastError("Failed to send email", error.message);
      }
    },
  });
}
