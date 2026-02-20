import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { Category, UpdateCategoryInput } from "@/lib/types/category";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


async function updateCategory(
  category_id: string,
  category_props: UpdateCategoryInput,
): Promise<ApiResponse<Category>> {
  const resp = await apiClient<Category, UpdateCategoryInput>(
    `${API_ADMIN_PREFIX}/categories/${category_id}`,
    {
      method: "patch",
      withCredentials: true,
      data: category_props,
    },
  );
  return resp;
}

export function useUpdateCategory(category_id: string) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Category>, ApiError, UpdateCategoryInput>({
    mutationFn: (category_props) => updateCategory(category_id, category_props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["parent-categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
        toastError(`Could not update category: ${error.message}`);
      }
    },
  });
}
