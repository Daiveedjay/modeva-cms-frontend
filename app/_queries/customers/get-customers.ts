import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { CustomerListItem } from "@/lib/types/customer";
import { SharedQueryParams } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";



export async function getCustomers(
  page = 1,
  limit = 10,
  signal?: AbortSignal,
): Promise<ApiResponse<CustomerListItem[]>> {
  const params: SharedQueryParams = { page, limit };

  const resp = await apiClient<CustomerListItem[], never, SharedQueryParams>(
    `${API_ADMIN_PREFIX}/customers`,
    {
      method: "get",
      params,
      signal,
    },
  );
  return resp;
}

export function useGetCustomers(page = 1, limit = 10) {
  return useQuery<ApiResponse<CustomerListItem[]>, ApiError>({
    queryKey: ["customers", page, limit],
    queryFn: ({ signal }) => getCustomers(page, limit, signal),
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
