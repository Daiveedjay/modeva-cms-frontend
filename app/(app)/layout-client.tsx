"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import QueryProvider from "./query-provider";
import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";
import { usePrivilegedModal } from "@/hooks/use-priviledged-modal";
import { useSuspendedModal } from "@/hooks/use-suspended-modal";
import { PrivilegedModal } from "@/components/reuseables/priviledged-modal";
import { SuspendedModal } from "@/components/reuseables/suspended-modal";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <LayoutWithModals>{children}</LayoutWithModals>
    </QueryProvider>
  );
}

function LayoutWithModals({ children }: { children: React.ReactNode }) {
  const { error, isError } = useGetAdminMe();
  const { shouldShow, close, dismiss } = usePrivilegedModal();
  const {
    shouldShow: shouldShowSuspendedModal,
    close: closeSuspendedModal,
    dismiss: dismissSuspendedModal,
  } = useSuspendedModal();

  // Get the HTTP status code from the error
  const errorStatus = error?.status || error?.statusCode;

  console.log("Error:", error);
  console.log("Error Status:", errorStatus);

  // Show suspended modal if 403 Forbidden (admin account is suspended)
  const showSuspendedModal =
    isError && errorStatus === 403 && shouldShowSuspendedModal;

  // Show unauthenticated modal if 401 Unauthorized (not logged in)
  // Don't show if we're showing the suspended modal instead
  const showUnauthenticatedModal =
    isError && errorStatus === 401 && shouldShow && !showSuspendedModal;

  return (
    <>
      <PrivilegedModal
        isOpen={showUnauthenticatedModal}
        onClose={close}
        onDismiss={dismiss}
      />
      <SuspendedModal
        isOpen={showSuspendedModal}
        onClose={closeSuspendedModal}
        onDismiss={dismissSuspendedModal}
      />
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <Toaster position="top-right" closeButton />
        <ReactQueryDevtools initialIsOpen={false} />
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarProvider>
    </>
  );
}
