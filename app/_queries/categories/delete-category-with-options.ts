import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import {
  DeleteCategoryWithOptionsRequest,
  Reassignment,
} from "@/lib/types/category";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deleteCategoryWithOptions(
  category_id: string,
  mode: "cascade" | "reassign",
  reassignments?: Reassignment[],
): Promise<ApiResponse<null>> {
  const body: DeleteCategoryWithOptionsRequest = { mode };
  if (mode === "reassign") {
    if (!reassignments || reassignments.length === 0) {
      throw new Error("reassignments required when mode is 'reassign'");
    }
    body.reassignments = reassignments;
  }

  const resp = await apiClient<null, DeleteCategoryWithOptionsRequest>(
    `${API_ADMIN_PREFIX}/categories/${category_id}/delete-with-options`,
    {
      method: "post",
      withCredentials: true,
      data: body,
    },
  );
  return resp;
}

export function useDeleteCategoryWithOptions(category_id: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    ApiError,
    DeleteCategoryWithOptionsRequest
  >({
    mutationFn: ({ mode, reassignments }) =>
      deleteCategoryWithOptions(category_id, mode, reassignments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["parent-categories"] });
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
