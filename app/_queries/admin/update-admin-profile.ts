import { apiClient, ApiError } from "@/app/_queries/api-client";
import { API_ADMIN_PREFIX } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { UpdateAdminProfileInput } from "@/lib/types/admin";
import { toastError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name";

const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "avatars";

async function uploadAvatarToCloudinary(
  file: File,
  adminId: string,
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  // Same public_id every time = implicit overwrite
  formData.append("public_id", `modeva/avatars/${adminId}/avatar`);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData,
    { timeout: 20000 },
  );

  return response.data.secure_url;
}

async function updateAdminProfile(
  input: UpdateAdminProfileInput & { adminId: string },
): Promise<ApiResponse<null>> {
  let avatar_url: string | undefined;

  if (input.avatar) {
    avatar_url = await uploadAvatarToCloudinary(input.avatar, input.adminId);
  }

  const payload = {
    name: input.name,
    phone_number: input.phone_number,
    country: input.country,
    avatar: avatar_url,
  };

  const resp = await apiClient<null, typeof payload>(
    `${API_ADMIN_PREFIX}/profile`,
    {
      method: "patch",
      data: payload,
      withCredentials: true,
      suppressGlobalError: true,
    },
  );

  return resp;
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    ApiError,
    UpdateAdminProfileInput & { adminId: string }
  >({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    },
    onError: (error: ApiError) => {
      if (error.isCanceled) return;

      if (error.statusCode === 400) {
        toastError(`Validation error: ${error.message}`);
      } else if (error.statusCode === 413) {
        toastError("Image too large. Please use an image under 5MB.");
      } else {
        toastError(`Could not update profile: ${error.message}`);
      }
    },
  });
}
