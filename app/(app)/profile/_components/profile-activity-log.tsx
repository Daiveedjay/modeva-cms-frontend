"use client";

import { useGetSingleAdminActivityLogs } from "@/app/_queries/admin/get-admin-activity-logs-by-id";
import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";
import { getDetailedActivityDescription } from "@/lib/activity-descriptions";
import { useAdminModalStore } from "@/lib/store/admins/use-admins-modal-store";
import { ActivityLog } from "@/lib/types/admin";
import {
  ChevronRight,
  Clock,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Shield,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

function getActivityIcon(resourceType: string) {
  switch (resourceType) {
    case "product":
      return Package;
    case "category":
      return FolderTree;
    case "order":
      return ShoppingCart;
    case "customer":
      return Users;
    case "admin":
      return Shield;
    default:
      return Activity;
  }
}

function getActivityIconColor(action: string): string {
  if (
    action.startsWith("created") ||
    action.startsWith("unsuspended") ||
    action.startsWith("unbanned") ||
    action.startsWith("accepted")
  ) {
    return "text-green-400";
  }
  if (action.startsWith("deleted") || action.startsWith("banned")) {
    return "text-red-400";
  }
  if (action.startsWith("suspended")) {
    return "text-orange-400";
  }
  return "text-primary";
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

interface ProfileActivityLogProps {
  onViewAll?: () => void;
}

export function ProfileActivityLog({ onViewAll }: ProfileActivityLogProps) {
  const { data: meData } = useGetAdminMe();
  const adminId = meData?.data?.id ?? "";

  const { data, isLoading } = useGetSingleAdminActivityLogs(adminId, 1, 6);
  const logs = data?.data?.logs ?? [];

  const openAdminModal = useAdminModalStore((store) => store.openAdminModal);
  const router = useRouter();
  const handleViewAll = () => {
    router.push("/admins?tab=activity");
    openAdminModal({
      type: "view-admin-activity",
      admin_id: adminId,
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-neutral-800" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-neutral-800 rounded w-3/4" />
                <div className="h-2 bg-neutral-800 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {logs.map((activity: ActivityLog, index: number) => {
          const IconComponent = getActivityIcon(activity.resource_type);
          const iconColor = getActivityIconColor(activity.action);
          const description = getDetailedActivityDescription(
            activity.action,
            activity.resource_type,
            activity.resource_name,
            activity.changes,
          );
          const isLast = index === logs.length - 1;

          return (
            <div key={activity.id} className="flex gap-3">
              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 shrink-0">
                  <IconComponent className={`w-4 h-4 ${iconColor}`} />
                </div>
                {!isLast && <div className="w-0.5 h-8 bg-neutral-800 my-1" />}
              </div>

              <div className="flex-1 flex justify-between">
                <div>
                  <p className="text-sm font-medium">{description}</p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(activity.created_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleViewAll}
        className="w-full cursor-pointer mt-6 px-4 py-2 text-sm font-medium text-primary bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors">
        View All Activity
      </button>
    </div>
  );
}
