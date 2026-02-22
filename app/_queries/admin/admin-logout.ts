import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, ApiError, void>({
    mutationFn: () => adminLogout(),
    onSuccess: () => {
      queryClient.setQueryData(["admin-me"], null); // ← clear immediately
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
      router.push("/");
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) return;
      toastError("Logout failed", error.message);
      queryClient.setQueryData(["admin-me"], null); // ← clear here too
      router.push("/");
    },
  });
}
