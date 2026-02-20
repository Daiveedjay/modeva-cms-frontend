import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { CustomerDetail } from "@/lib/types/customer";
import { useQuery } from "@tanstack/react-query";

export async function getCustomerById(
  customerId: string,
  signal?: AbortSignal
): Promise<ApiResponse<CustomerDetail>> {
  const resp = await apiClient<CustomerDetail, never>(
    `${API_ADMIN_PREFIX}/customers/${customerId}`,
    {
      method: "get",
      signal,
    }
  );
  return resp;
}

export function useGetCustomerById(
  customerId: string,
  enabled: { enabled: boolean }
) {
  return useQuery<ApiResponse<CustomerDetail>, ApiError>({
    queryKey: ["customer", customerId],
    enabled: enabled.enabled || !!customerId,
    queryFn: ({ signal }) => getCustomerById(customerId, signal),
    // placeholderData: keepPreviousData,
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
