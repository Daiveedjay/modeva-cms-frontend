"use client";

import { useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import { Card } from "@/components/ui/card";
import ProfileStats from "@/app/(app)/profile/_components/profile-stats";
import { ProfileHeader } from "@/app/(app)/profile/_components/profile-header";
import { ProfileInfo } from "@/app/(app)/profile/_components/profile-info";
import { ProfileActivityLog } from "@/app/(app)/profile/_components/profile-activity-log";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ProfileStats />
      <div className=" p-4 sm-p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Section */}
            <Card className="bg-neutral-900 border-neutral-800 p-8">
              <ProfileHeader />
            </Card>

            {/* Personal Information Section */}
            <Card className="bg-neutral-900 border-neutral-800 p-8">
              <ProfileInfo />
            </Card>
          </div>

          {/* Right Column - Activity Log */}
          <div className="lg:col-span-1">
            <Card className="bg-neutral-900 border-neutral-800 p-6 h-fit sticky top-8">
              <ProfileActivityLog />
            </Card>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Management
            </h1>
            <p className="text-muted-foreground">
              Manage admin users and monitor system activity
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </div>
      </div> */}
    </SidebarInset>
  );
}
