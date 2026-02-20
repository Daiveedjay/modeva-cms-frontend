import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Admin } from "@/lib/types/admin";
import { SharedQueryParams } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export async function getAdmins(
  page = 1,
  limit = 10,
  signal?: AbortSignal,
): Promise<ApiResponse<Admin[]>> {
  const params: SharedQueryParams = { page, limit };
  const resp = await apiClient<Admin[], never, SharedQueryParams>(
    `${API_ADMIN_PREFIX}/admins`,
    {
      method: "get",
      params,
      withCredentials: true,
      signal,
    },
  );
  return resp;
}

export function useGetAdmins(page = 1, limit = 10) {
  return useQuery<ApiResponse<Admin[]>, ApiError>({
    queryKey: ["admins", page, limit],
    queryFn: ({ signal }) => getAdmins(page, limit, signal),
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
