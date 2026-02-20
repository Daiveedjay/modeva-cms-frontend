// File: app/(app)/admins/layout.tsx
// This layout wraps only the admins route and its children
// Auth check happens here before rendering admins pages

"use client";

import { useRouter } from "next/navigation";
import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";
import { Spinner } from "@/components/reuseables/spinner";
import { useEffect } from "react";

export default function AdminsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading, error, isError } = useGetAdminMe();

  // Redirect if not authenticated
  useEffect(() => {
    if (isError && !isLoading) {
      router.push("/");
    }
  }, [isError, isLoading, router]);

  // Still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Not authenticated
  if (error || !data?.data) {
    return null;
  }

  // Authenticated - show admins pages
  return <>{children}</>;
}
