import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { UpdateCustomerInput, UpdateCustomerResponse } from "@/lib/types/customer";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


async function updateCustomerDetails(
  customer_id: string,
  customer_props: UpdateCustomerInput,
): Promise<ApiResponse<UpdateCustomerResponse>> {
  const resp = await apiClient<UpdateCustomerResponse, UpdateCustomerInput>(
    `${API_ADMIN_PREFIX}/customers/${customer_id}`,
    {
      method: "patch",
      withCredentials: true,
      data: customer_props,
    },
  );
  return resp;
}

export function useUpdateCustomerDetails(customer_id: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UpdateCustomerResponse>,
    ApiError,
    UpdateCustomerInput
  >({
    mutationFn: (customer_props) =>
      updateCustomerDetails(customer_id, customer_props),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
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
        toastError(`Could not update customer details: ${error.message}`);
      }
    },
  });
}
