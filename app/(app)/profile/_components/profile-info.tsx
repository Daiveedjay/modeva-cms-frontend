"use client";

import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";

export function ProfileInfo() {
  const { data, isLoading } = useGetAdminMe();
  const profile = data?.data;

  if (isLoading) {
    return <ProfileInfoSkeleton />;
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <p className="text-sm text-muted-foreground">
            View your account details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem label="Full Name" value={profile?.name || "—"} />
        <InfoItem label="Email Address" value={profile?.email || "—"} />
        <InfoItem label="Phone Number" value={profile?.phone_number || "—"} />
        <InfoItem label="Country" value={profile?.country || "—"} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

function ProfileInfoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItemSkeleton />
        <InfoItemSkeleton />
        <InfoItemSkeleton />
        <InfoItemSkeleton />
      </div>
    </div>
  );
}

function InfoItemSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-5 w-40" />
    </div>
  );
}
