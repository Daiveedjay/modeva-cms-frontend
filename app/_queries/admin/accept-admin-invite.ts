import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { AcceptAdminInviteRequest, AdminMeResponse } from "@/lib/types/admin";
import { toastError } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

export async function acceptAdminInvite(
  accept_invite_props: AcceptAdminInviteRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<AdminMeResponse>> {
  const response = await apiClient<AdminMeResponse>(
    `${API_ADMIN_PREFIX}/accept-invite`,
    {
      method: "post",
      data: accept_invite_props,
      signal,
      withCredentials: true,
      suppressGlobalError: false,
    },
  );

  return response;
}

export function useAcceptAdminInvite() {
  return useMutation<
    ApiResponse<AdminMeResponse>,
    ApiError,
    AcceptAdminInviteRequest
  >({
    mutationFn: (req) => acceptAdminInvite(req),
    retry: false, // Don't retry on failure - invitation tokens are sensitive
    onError: (error: ApiError) => {
      if (error.isCanceled) {
        return;
      }
      if (error.statusCode === 400) {
        toastError("Validation error", error.message);
      } else if (error.statusCode === 404) {
        toastError(
          "Invalid invitation",
          "This invitation link is invalid or has expired.",
        );
      } else if (error.statusCode === 409) {
        toastError(
          "Already accepted",
          "This invitation has already been used.",
        );
      } else if (error.statusCode === 410) {
        toastError("Invitation expired", "This invitation link has expired.");
      } else {
        toastError("Could not accept invitation", error.message);
      }
    },
  });
}
