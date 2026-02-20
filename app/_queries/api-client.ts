// api-client.ts - FIXED with status property on error

import { API_ENDPOINT } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import axios, { AxiosInstance, AxiosError } from "axios";

export class ApiError extends Error {
  statusCode: number | null;
  status: number | null; // Add this property
  payload?: ApiResponse<unknown>;
  isCanceled: boolean;
  suppressGlobalError: boolean;

  constructor(
    message: string,
    statusCode: number | null = null,
    payload?: ApiResponse<unknown>,
    isCanceled = false,
    suppressGlobalError = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.status = statusCode; // Mirror the property
    this.payload = payload;
    this.isCanceled = isCanceled;
    this.suppressGlobalError = suppressGlobalError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// FIXED: Better cookie parser that handles complex tokens
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieString = document.cookie;

  // Use regex to find admin_token cookie
  const match = cookieString.match(/admin_token=([^;]*)/);

  if (match && match[1]) {
    const token = match[1];
    console.log(
      "[apiClient] ✓ Found admin_token:",
      token.substring(0, 30) + "...",
    );
    return token;
  }

  console.log("[apiClient] ✗ admin_token not found in cookies");
  return null;
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.withCredentials) {
      console.log(
        `[apiClient] REQUEST: ${config.method?.toUpperCase()} ${config.url}`,
      );
      const token = getTokenFromCookie();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[apiClient] ✓ Added Authorization header");
      } else {
        console.log(
          "[apiClient] ✗ No token found - skipping Authorization header",
        );
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `[apiClient] RESPONSE ${response.status}: ${response.config.url}`,
    );
    return response;
  },
  (error: AxiosError) => {
    console.log(
      `[apiClient] ERROR ${error.response?.status}: ${error.config?.url}`,
    );

    if (error.response?.status === 401) {
      console.log("[apiClient] Got 401 - dispatching auth:unauthorized");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  },
);

export interface ApiClientOptions<
  TData = unknown,
  TParams = Record<string, unknown>,
> {
  method?: "get" | "post" | "put" | "delete" | "patch";
  data?: TData;
  params?: TParams;
  signal?: AbortSignal;
  withCredentials?: boolean;
  suppressGlobalError?: boolean;
}

export async function apiClient<
  TResponse,
  TData = unknown,
  TParams = Record<string, unknown>,
>(
  url: string,
  options?: ApiClientOptions<TData, TParams>,
): Promise<ApiResponse<TResponse>> {
  try {
    const response = await axiosInstance.request<ApiResponse<TResponse>>({
      url,
      method: options?.method ?? "get",
      data: options?.data,
      params: options?.params,
      signal: options?.signal,
      withCredentials: options?.withCredentials ?? false,
    });

    const respData = response.data;

    if (respData.error) {
      throw new ApiError(
        respData.message,
        response.status,
        respData,
        false,
        options?.suppressGlobalError ?? false,
      );
    }

    return respData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<unknown>;

      if (axiosErr.code === "ERR_CANCELED") {
        throw new ApiError("Request canceled", null, undefined, true);
      }

      if (axiosErr.response) {
        const resp = axiosErr.response;
        let payload: ApiResponse<unknown> | undefined;
        if (typeof resp.data === "object" && resp.data !== null) {
          payload = resp.data as ApiResponse<unknown>;
        }
        const message =
          (payload?.message as string) ?? resp.statusText ?? "Unknown error";

        throw new ApiError(
          message,
          resp.status,
          payload,
          false,
          options?.suppressGlobalError ?? false,
        );
      }

      if (axiosErr.request) {
        throw new ApiError(
          "No response from server",
          null,
          undefined,
          false,
          options?.suppressGlobalError ?? false,
        );
      }

      throw new ApiError(
        axiosErr.message,
        null,
        undefined,
        false,
        options?.suppressGlobalError ?? false,
      );
    }

    if (err instanceof Error) {
      throw new ApiError(
        err.message,
        null,
        undefined,
        false,
        options?.suppressGlobalError ?? false,
      );
    }

    throw new ApiError(
      String(err),
      null,
      undefined,
      false,
      options?.suppressGlobalError ?? false,
    );
  }
}

export function clearAdminTokenCookie(): void {
  document.cookie =
    "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  console.log("[apiClient] admin_token cookie cleared");
}
