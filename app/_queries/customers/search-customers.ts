import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { CustomerListItem, SearchCustomersFilters, SearchCustomersParams } from "@/lib/types/customer";
import { useQuery } from "@tanstack/react-query";


export async function searchCustomers(
  params: SearchCustomersParams,
  signal?: AbortSignal,
): Promise<ApiResponse<CustomerListItem[]>> {
  const resp = await apiClient<CustomerListItem[], never, SearchCustomersParams>(
    `${API_ADMIN_PREFIX}/customers`,
    {
      method: "get",
      params,
      signal,
    },
  );
  return resp;
}

export function useSearchCustomers(
  filters: SearchCustomersFilters,
  page: number = 1,
  limit: number = 5,
  enabled: boolean = true,
) {
  const params: SearchCustomersParams = {
    page,
    limit,
    q: filters.query.trim() || undefined,
    email: filters.email.trim() || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    joined_from: filters.joinedFrom
      ? filters.joinedFrom.toISOString().split("T")[0]
      : undefined,
    joined_to: filters.joinedTo
      ? filters.joinedTo.toISOString().split("T")[0]
      : undefined,
    country: filters.country || undefined,
    spending_exact: filters.useExactSpending
      ? filters.exactSpending
      : undefined,
    spending_min: !filters.useExactSpending ? filters.spendingMin : undefined,
    spending_max: !filters.useExactSpending ? filters.spendingMax : undefined,
  };

  return useQuery<ApiResponse<CustomerListItem[]>, ApiError>({
    queryKey: ["customers-search", JSON.stringify(filters), page, limit],
    queryFn: ({ signal }) => searchCustomers(params, signal),
    enabled,
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
