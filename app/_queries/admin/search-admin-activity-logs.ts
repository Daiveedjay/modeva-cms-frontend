
import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { ActivityLog, ActivityLogSearchParams } from "@/lib/types/admin";
import { useQuery, keepPreviousData } from "@tanstack/react-query";




export interface SearchActivityLogsResponse {
  logs: ActivityLog[];
}

function cleanParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k as keyof T] = v as T[keyof T];
  }
  return out;
}

export async function searchAdminActivityLogs(
  params: ActivityLogSearchParams,
  signal?: AbortSignal,
): Promise<ApiResponse<SearchActivityLogsResponse>> {
  const resp = await apiClient<SearchActivityLogsResponse, never, ActivityLogSearchParams>(
    `${API_ADMIN_PREFIX}/admins/activity-logs/search`,
    {
      method: "get",
      withCredentials: true,
      params: cleanParams({
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        query: params.query,
        action: params.action,
        status: params.status,
        resource_type: params.resource_type,
        admin_email: params.admin_email,
        created_from: params.created_from,
        created_to: params.created_to,
      }),
      signal,
    },
  );

  return resp;
}

export function useSearchAdminActivityLogs(
  params: ActivityLogSearchParams,
  enabled: boolean,
) {
  return useQuery<ApiResponse<SearchActivityLogsResponse>, ApiError>({
    queryKey: ["admin-activity-logs-search", params],
    queryFn: ({ signal }) => searchAdminActivityLogs(params, signal),
    placeholderData: keepPreviousData,
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