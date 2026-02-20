import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { AllAdminActivityLogsResponse } from "@/lib/types/admin";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

async function getAllAdminActivityLogs(
  page: number = 1,
  limit: number = 20,
  adminId?: string,
  action?: string,
): Promise<ApiResponse<AllAdminActivityLogsResponse>> {
  const params: Record<string, string | number> = { page, limit };

  if (adminId) params.admin_id = adminId;
  if (action) params.action = action;

  const resp = await apiClient<AllAdminActivityLogsResponse>(
    `${API_ADMIN_PREFIX}/admins/activity-logs`,
    {
      method: "get",
      withCredentials: true,
      params,
      suppressGlobalError: false,
    },
  );
  return resp;
}

interface UseGetAllAdminActivityOptions {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
}

export function useGetAllAdminActivityLogs(
  options: UseGetAllAdminActivityOptions = {},
) {
  const { page = 1, limit = 20, adminId, action } = options;

  return useQuery<ApiResponse<AllAdminActivityLogsResponse>, ApiError>({
    queryKey: ["all-admin-activity", page, limit, adminId, action],
    queryFn: () => getAllAdminActivityLogs(page, limit, adminId, action),

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
