import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { AdminMeResponse } from "@/lib/types/admin";
import { useQuery } from "@tanstack/react-query";

async function getAdminMe(): Promise<ApiResponse<AdminMeResponse>> {
  const resp = await apiClient<AdminMeResponse>(`${API_ADMIN_PREFIX}/me`, {
    method: "get",
    withCredentials: true,
    suppressGlobalError: true,
  });

  return resp;
}

export function useGetAdminMe() {
  return useQuery<ApiResponse<AdminMeResponse>, ApiError>({
    queryKey: ["admin-me"],
    queryFn: getAdminMe,
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
