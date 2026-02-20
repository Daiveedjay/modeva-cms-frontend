import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Category, CreateCategoryInput } from "@/lib/types/category";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";



async function createCategory(
  category_props: CreateCategoryInput,
): Promise<ApiResponse<Category>> {
  const resp = await apiClient<Category, CreateCategoryInput>(
    `${API_ADMIN_PREFIX}/categories`,
    {
      method: "post",
      withCredentials: true,
      data: category_props,
    },
  );
  return resp;
}

export function useCreateCategory({
  parent_id,
}: { parent_id?: string | null } = {}) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Category>, ApiError, CreateCategoryInput>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", parent_id] });
      queryClient.invalidateQueries({ queryKey: ["parent-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });

      queryClient.invalidateQueries({
        queryKey: ["admin-activity"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-admin-activity"],
      });
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
        toastError(`Could not add category: ${error.message}`);
      }
    },
  });
}
