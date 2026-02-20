import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { SuspendAdminRequest } from "@/lib/types/admin";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function suspendAdmin(
  req: SuspendAdminRequest,
): Promise<ApiResponse<null>> {
  const resp = await apiClient<null, SuspendAdminRequest>(
    `${API_ADMIN_PREFIX}/admins/${req.admin_id}/suspend`,
    {
      method: "post",
      withCredentials: true,
      data: {
        reason: req.reason,
        admin_id: req.admin_id,
      },
      suppressGlobalError: false,
    },
  );
  return resp;
}

export function useSuspendAdmin() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, ApiError, SuspendAdminRequest>({
    mutationFn: suspendAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
      queryClient.invalidateQueries({ queryKey: ["all-admin-activity"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) {
        return;
      }
      if (error.statusCode === 400) {
        toastError(`Validation error: ${error.message}`);
      } else if (error.statusCode === 404) {
        toastError(`Admin not found: ${error.message}`);
      } else if (error.statusCode === 409) {
        toastError(`Conflict: ${error.message}`);
      } else {
        toastError(`Could not suspend admin: ${error.message}`);
      }
    },
  });
}
