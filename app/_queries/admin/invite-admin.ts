import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { InviteAdminInput } from "@/lib/types/admin";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


async function inviteAdmin(
  req: InviteAdminInput,
): Promise<ApiResponse<{email: string, expires: string}>> {
  const resp = await apiClient<{email: string, expires: string}, InviteAdminInput>(
    `${API_ADMIN_PREFIX}/invite`,
    {
      method: "post",
      withCredentials: true,
      data: req,
      suppressGlobalError: false,
    },
  );
  return resp;
}

export function useInviteAdmin() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{email: string, expires: string}>, ApiError, InviteAdminInput>({
    mutationFn: inviteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      },
    onError: (error: ApiError) => {
          if (error.isCanceled) {
            // maybe ignore if canceled
            return;
          }
          if (error.statusCode === 400) {
            // validation error
            toastError(`Validation error: ${error.message}`);
          } else if (error.statusCode === 409) {
            // conflict, e.g. duplicate name
            toastError(`Conflict: ${error.message}`);
          } else {
            // generic error
            toastError(`Could not invite admin: ${error.message}`);
          }
        },
  });
}