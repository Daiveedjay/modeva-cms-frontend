import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { AdminLoginInput, AdminLoginResponse } from "@/lib/types/admin";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function adminLogin(
  login_props: AdminLoginInput,
): Promise<ApiResponse<AdminLoginResponse>> {
  const resp = await apiClient<AdminLoginResponse, AdminLoginInput>(
    `${API_ADMIN_PREFIX}/login`,
    {
      method: "post",
      data: login_props,
      withCredentials: true,
      suppressGlobalError: false,
    },
  );
  return resp;
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<AdminLoginResponse>,
    ApiError,
    AdminLoginInput
  >({
    mutationFn: adminLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) {
        return;
      }
      if (error.statusCode === 401) {
        toastError(
          "Invalid credentials",
          "Please check your email and password.",
        );
      } else if (error.statusCode === 403) {
        toastError(
          "Account suspended. ",
          "Your account has been suspended. Please contact support.",
        );
      } else if (error.statusCode === 429) {
        toastError(
          "Too many attempts",
          "Too many login attempts. Please try again later.",
        );
      } else {
        toastError("Login failed", error.message);
      }
    },
  });
}
