"use client";

import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";
import { getMonthYear, getRelativeDays } from "@/lib/date-time-utils";
import Image from "next/image";

export function ProfileHeader() {
  const { data, isLoading } = useGetAdminMe();
  const profile = data?.data;

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <div className="flex items-start gap-8">
      <div className="relative">
        <div className="w-28 h-28 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
          <Image
            src={profile?.avatar || "/david.webp"}
            alt="Profile"
            width={112}
            height={112}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Admin Info */}
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-white">
          {profile?.name || "Admin User"}
        </h3>
        <p className="text-neutral-400 text-sm mt-1">
          {profile?.email || "admin@modeva.com"}
        </p>

        <div className="flex gap-4 mt-4">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Role
            </p>
            <p className="text-white font-medium">
              {profile?.role === "super_admin"
                ? "Super admin access"
                : "Admin access"}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              {getMonthYear(profile?.joined_at)}
            </p>
            <p className="text-white font-medium">
              {getRelativeDays(profile?.joined_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-start gap-8">
      {/* Avatar */}
      <div className="w-28 h-28 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />

        <div className="flex gap-4">
          <div>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div>
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
