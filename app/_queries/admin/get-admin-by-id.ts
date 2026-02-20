
import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Admin } from "@/lib/types/admin";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export async function getAdminById(
  adminId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Admin>> {
  const resp = await apiClient<Admin, null>(
    `${API_ADMIN_PREFIX}/admins/${adminId}`,
    {
      method: "get",
      withCredentials: true,
      signal,
    },
  );
  return resp;
}

export function useGetAdminById(
  adminId: string,
  enabled: { enabled: boolean },
) {
  return useQuery<ApiResponse<Admin>, ApiError>({
    queryKey: ["admin", adminId],
    enabled: enabled.enabled || !!adminId,
    queryFn: ({ signal }) => getAdminById(adminId, signal),
    placeholderData: keepPreviousData,
    // meta: { showGlobalError: true },
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
