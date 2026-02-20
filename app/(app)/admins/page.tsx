"use client";

import AdminTabs from "@/app/(app)/admins/_components/admin-tabs";
import AdminsStats from "@/app/(app)/admins/_components/admin-stats";
import { InviteAdminModal } from "@/app/(app)/admins/_modal/invite-admin-modal";
import { SuspendAdminModal } from "@/app/(app)/admins/_modal/suspend-admin-modal";
import { UnsuspendAdminModal } from "@/app/(app)/admins/_modal/unsuspend-admin-modal";
import { ViewAdminActivityModal } from "@/app/(app)/admins/_modal/view-admin-activity-modal";
import { ViewAdminDetailsModal } from "@/app/(app)/admins/_modal/view-admin-details-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AdminsPage() {
  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Admins</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Management
            </h1>
            <p className="text-muted-foreground">
              Manage admin users and monitor system activity
            </p>
          </div>
          <Button onClick={() => setShowInviteModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Admin
          </Button>
        </div>

        {/* Stats Cards */}
        <AdminsStats />

        <AdminTabs />
      </div>

      {/* Modals */}
      <InviteAdminModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        // onAddAdmin={handleAddAdmin}
      />

      {/* Modals */}
      <ViewAdminDetailsModal />
      <ViewAdminActivityModal
      // open={activityOpen}
      // admin={admin}
      // onOpenChange={setActivityOpen}
      />
      <SuspendAdminModal
      // open={suspendOpen}
      // admin={admin}
      // onOpenChange={setSuspendOpen}
      // onConfirm={handleSuspend}
      // isLoading={isLoading}
      />
      <UnsuspendAdminModal />
    </SidebarInset>
  );
}
