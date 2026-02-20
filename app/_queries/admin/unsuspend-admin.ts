import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { UnsuspendAdminRequest } from "@/lib/types/admin";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function unsuspendAdmin(
  req: UnsuspendAdminRequest,
): Promise<ApiResponse<null>> {
  const resp = await apiClient<null>(
    `${API_ADMIN_PREFIX}/admins/${req.admin_id}/unsuspend`,
    {
      method: "post",
      withCredentials: true,
      suppressGlobalError: false,
    },
  );
  return resp;
}

export function useUnsuspendAdmin() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, ApiError, UnsuspendAdminRequest>({
    mutationFn: unsuspendAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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
        toastError(`Could not unsuspend admin: ${error.message}`);
      }
    },
  });
}
