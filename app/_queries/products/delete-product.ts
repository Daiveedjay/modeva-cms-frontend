import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteProduct(productId: string): Promise<ApiResponse<null>> {
  const resp = await apiClient<null>(
    `${API_ADMIN_PREFIX}/products/${productId}`,
    {
      method: "delete",
      withCredentials: true,
    },
  );
  return resp;
}

export function useDeleteProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, ApiError, void>({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products", "stats"] });
      queryClient.invalidateQueries({
        queryKey: ["all-admin-activity"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
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
        toastError(`Could not delete product: ${error.message}`);
      }
    },
  });
}
