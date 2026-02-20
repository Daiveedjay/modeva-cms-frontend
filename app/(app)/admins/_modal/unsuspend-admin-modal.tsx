"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAdminModalStore } from "@/lib/store/admins/use-admins-modal-store";
import { useUnsuspendAdmin } from "@/app/_queries/admin/unsuspend-admin";
import { useGetAdminById } from "@/app/_queries/admin/get-admin-by-id";
import { Badge } from "@/components/ui/badge";
import { capitaliseFirstLetter, toastSuccess } from "@/lib/utils";
import { Spinner } from "@/components/reuseables/spinner";

export function UnsuspendAdminModal() {
  const { adminModal, closeAdminModal } = useAdminModalStore((s) => s);

  const { mutateAsync: unsuspendAdmin, isPending } = useUnsuspendAdmin();

  const open = adminModal?.type === "unsuspend-admin";
  const admin_id = adminModal?.admin_id;

  const shouldFetchAdmin = open && Boolean(admin_id);

  const { data, isError, isLoading, error } = useGetAdminById(admin_id!, {
    enabled: shouldFetchAdmin,
  });

  const admin_data = data?.data;

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;

  // Show error dialog if admin fetch failed
  if (isError || !admin_data) {
    return (
      <Dialog open={open} onOpenChange={closeAdminModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Failed to load admin</DialogTitle>
            <DialogDescription>
              {error?.message ||
                "Could not load admin details. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={closeAdminModal}
            variant="outline"
            className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const handleConfirm = async () => {
    if (!admin_id) return;

    try {
      await unsuspendAdmin({ admin_id });

      toastSuccess("Admin unsuspended successfully");
      closeAdminModal();
    } catch (error) {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isPending) closeAdminModal();
      }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Restore Admin
          </DialogTitle>
          <DialogDescription>
            Restore {admin_data.name}&apos;s account access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-success/10 p-3 text-sm text-success">
            ✓ {admin_data.name} will regain access to admin activities and
            protected routes immediately
          </div>

          <div className="rounded-md border p-3">
            <p className="text-sm font-medium">{admin_data.name}</p>
            <p className="text-xs text-muted-foreground">{admin_data.email}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Status:{" "}
              <Badge
                variant={
                  admin_data.status === "active"
                    ? "default"
                    : admin_data.status === "inactive"
                      ? "secondary"
                      : "destructive"
                }>
                {capitaliseFirstLetter(admin_data.status ?? "")}
              </Badge>
            </p>
          </div>

          <div className="rounded-md bg-muted p-3 text-sm">
            <p>Are you sure you want to restore this admin&apos;s access?</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={closeAdminModal}
              disabled={isPending}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={isPending}>
              {isPending && <Spinner />}
              {isPending ? "Restoring..." : "Restore"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
