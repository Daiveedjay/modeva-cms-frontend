// app/providers/query-provider.tsx
"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { useState } from "react";
import { toastError } from "@/lib/utils";
import { ApiError } from "@/app/_queries/api-client";

const TOAST_TTL_MS = 3000;

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => {
    // de-dup identical toasts per-query-hash+message
    const seen = new Set<string>();

    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          // Check if error has suppressGlobalError flag
          if (error instanceof ApiError && error.suppressGlobalError) {
            return; // Don't show toast
          }

          // allow per-query opt-out
          // NOTE: some setups expose meta on query.meta, others on query.options.meta.
          const meta = query.meta ?? query.options?.meta;
          if (meta?.preventGlobalError) return;

          const message = (error as Error)?.message ?? "Unknown error";
          const sig = `${query.queryHash}|${message}`;
          if (seen.has(sig)) return;
          seen.add(sig);
          setTimeout(() => seen.delete(sig), TOAST_TTL_MS);

          const rootKey =
            Array.isArray(query.queryKey) && query.queryKey.length
              ? String(query.queryKey[0])
              : "query";

          const hasData = query.state.data !== undefined;
          toastError(
            `${hasData ? "Error updating" : "Error fetching"} ${rootKey}: ${message}`,
          );
        },
      }),
      defaultOptions: {
        queries: {
          // keep errors in state instead of throwing to error boundaries
          throwOnError: false,
          // keep data fresh without triggering background refetchs too often
          staleTime: 10 * 60 * 1000, // 10 min
          refetchOnWindowFocus: false,
          // avoid global polling; enable per-query only if needed
          // refetchInterval: 30 * 60 * 1000,
          retry: 3,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
