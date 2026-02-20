"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useClearQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearParams = (keys?: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!keys || keys.length === 0) {
      // Clear everything
      router.replace(pathname);
      return;
    }

    keys.forEach((key) => params.delete(key));

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return { clearParams };
}
