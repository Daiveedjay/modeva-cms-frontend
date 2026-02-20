"use client";

import { useGetAdminById } from "@/app/_queries/admin/get-admin-by-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminModalStore } from "@/lib/store/admins/use-admins-modal-store";
import { getMonthYear, getTime } from "@/lib/date-time-utils";
import { User } from "lucide-react";

export function ViewAdminDetailsModal() {
  const adminModal = useAdminModalStore((s) => s.adminModal);
  const closeAdminModal = useAdminModalStore((s) => s.closeAdminModal);

  const open =
    !!adminModal?.admin_id && adminModal.type === "view-admin-details";
  const admin = adminModal?.admin_id ?? null;

  const adminId = adminModal?.admin_id ?? "";

  const { data, isError, isLoading, error } = useGetAdminById(adminId, {
    enabled: open,
  });

  const adminData = data?.data;

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="p-4">Error loading order details: {error.message}</div>
    );
  }

  if (adminData === null || adminData === undefined) {
    return null;
  }

  // guard AFTER hooks
  if (!open || !admin) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeAdminModal();
      }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Details</DialogTitle>
          <DialogDescription>View admin profile information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={adminData?.avatar || "/placeholder.svg"}
                alt={adminData?.name}
              />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{adminData?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {adminData?.email}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Role
              </p>
              <p className="text-sm font-medium mt-1">
                {adminData?.role === "super_admin" ? "Super Admin" : "Admin"}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Status
              </p>
              <div className="mt-1">
                <Badge
                  variant={
                    adminData?.status === "active"
                      ? "default"
                      : adminData?.status === "inactive"
                        ? "secondary"
                        : "destructive"
                  }>
                  {adminData?.status.charAt(0).toUpperCase() +
                    adminData?.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Phone */}
            <div className="col-span-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Phone
              </p>
              <p className="text-sm font-medium mt-1">
                {adminData?.phone_number || "Not provided"}
              </p>
            </div>

            {/* Country */}
            <div className="col-span-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Country
              </p>
              <p className="text-sm font-medium mt-1">
                {adminData?.country || "Not provided"}
              </p>
            </div>

            {/* Joined */}
            <div className="col-span-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Joined
              </p>
              <p className="text-sm font-medium mt-1">
                {getMonthYear(adminData?.joined_at)}
              </p>
            </div>

            {/* Last Login */}
            <div className="col-span-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Last Login
              </p>
              <p className="text-sm font-medium mt-1">
                {getTime(adminData?.last_login_at || undefined) || "Never"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
