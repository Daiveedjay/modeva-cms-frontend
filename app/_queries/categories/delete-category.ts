import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteCategory(category_id: string): Promise<ApiResponse<null>> {
  const resp = await apiClient<null>(
    `${API_ADMIN_PREFIX}/categories/${category_id}`,
    {
      method: "delete",
      withCredentials: true,
    },
  );
  return resp;
}

export function useDeleteCategory(
  category_id: string,
  parent_id?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, ApiError, void>({
    mutationFn: () => deleteCategory(category_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", parent_id] });
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
      queryClient.invalidateQueries({ queryKey: ["all-admin-activity"] });
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) {
        return;
      }
      if (error.statusCode === 400) {
        toastError(`Validation error: ${error.message}`);
      } else if (error.statusCode === 409) {
        toastError(`Conflict: ${error.message}`);
      } else {
        toastError(`Could not delete category: ${error.message}`);
      }
    },
  });
}
