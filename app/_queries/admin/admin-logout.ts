import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { toastError } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function adminLogout(): Promise<ApiResponse<null>> {
  const resp = await apiClient<null>(`${API_ADMIN_PREFIX}/logout`, {
    method: "post",
    withCredentials: true,
  });
  return resp;
}

export function useAdminLogout() {
  const router = useRouter();

  return useMutation<ApiResponse<null>, ApiError, void>({
    mutationFn: () => adminLogout(),
    onSuccess: () => {
      // Redirect to login after successful logout
      router.push("/");
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) {
        return;
      }

      // Show error toast
      toastError("Logout failed", error.message);

      // Still redirect even if logout fails (session might be corrupted)
      router.push("/");
    },
  });
}
