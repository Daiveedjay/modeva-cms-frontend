import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/app/_queries/api-client";
import { ApiResponse } from "@/lib/types";
import { API_ADMIN_PREFIX } from "@/lib/constants";

export interface AdminStats {
  total_admins: number;
  active_admins: number;
  active_sessions: number;
  daily_actions: number;
  system_status: string;
}

// Fetch admin stats
async function getAdminStats(
  signal?: AbortSignal,
): Promise<ApiResponse<AdminStats>> {
  return await apiClient<AdminStats>(`${API_ADMIN_PREFIX}/stats`, {
    method: "get",
    signal,
    withCredentials: true,
  });
}

// Hook for admin stats
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: ({ signal }) => getAdminStats(signal),
  });
}
