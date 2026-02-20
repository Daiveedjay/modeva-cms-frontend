import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { ActivityLogsResponse } from "@/lib/types/admin";
import { useQuery } from "@tanstack/react-query";




async function getSingleAdminActivityLogs(
  adminId: string,
  page: number = 1,
  limit: number = 20,
): Promise<ApiResponse<ActivityLogsResponse>> {
  const resp = await apiClient<ActivityLogsResponse>(
    `${API_ADMIN_PREFIX}/admins/${adminId}/activity-logs`,
    {
      method: "get",
      withCredentials: true,
      params: { page, limit },
      suppressGlobalError: false,
    },
  );

  return resp;
}

export function useGetSingleAdminActivityLogs(
  adminId: string,
  page: number = 1,
  limit: number = 20,
) {
  return useQuery<ApiResponse<ActivityLogsResponse>, ApiError>({
    queryKey: ["admin-activity", adminId, page, limit],
    queryFn: () => getSingleAdminActivityLogs(adminId, page, limit),
    enabled: Boolean(adminId),
  });
}
