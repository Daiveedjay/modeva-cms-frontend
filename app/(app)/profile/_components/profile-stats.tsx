"use client";

import { EditProfileModal } from "@/app/(app)/profile/_modals/edit-profile-modal";
import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMonthYear, getRelativeDays } from "@/lib/date-time-utils";
import { getTime } from "date-fns";

import { Clock, LogIn, Shield, User } from "lucide-react";
import { useState } from "react";

export default function ProfileStats() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetAdminMe();
  const profile = data?.data;

  const getMissingProfileFields = () => {
    if (!profile) return [];

    const missing: string[] = [];

    if (!profile.avatar) missing.push("Avatar");
    if (!profile.phone_number) missing.push("Phone number");
    if (!profile.country) missing.push("Country");

    return missing;
  };

  const missingFields = getMissingProfileFields();

  const profileStatusColor =
    missingFields.length === 0
      ? "text-green-500"
      : missingFields.length <= 2
        ? "text-yellow-500"
        : "text-destructive";

  const profileSubLabel =
    missingFields.length === 0
      ? "100% verified"
      : `Missing: ${missingFields.join(", ")}`;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <HeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Management
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and view activity
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <User className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Account Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Status
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.status === "active" ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.role === "super_admin"
                ? "Super admin access"
                : "Admin access"}
            </p>
          </CardContent>
        </Card>

        {/* Last Login */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getRelativeDays(profile?.last_login_at)}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.last_login_at
                ? getTime(new Date(profile.last_login_at))
                : "—"}
            </p>
          </CardContent>
        </Card>

        {/* Member Since */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getMonthYear(profile?.joined_at)}
            </div>
            <p className="text-xs text-muted-foreground">
              {getRelativeDays(profile?.joined_at)}
            </p>
          </CardContent>
        </Card>

        {/* Profile Status */}
        {/* Profile Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Status
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profileStatusColor}`}>
              {missingFields.length === 0 ? "Complete" : "Incomplete"}
            </div>
            <p className="text-xs text-muted-foreground">{profileSubLabel}</p>
          </CardContent>
        </Card>
      </div>
      <EditProfileModal open={open} close={() => setOpen(false)} />
    </div>
  );
}
function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-20 mb-2" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}
