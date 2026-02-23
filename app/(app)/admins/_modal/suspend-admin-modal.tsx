"use client";

import { useGetAdminById } from "@/app/_queries/admin/get-admin-by-id";
import { useSuspendAdmin } from "@/app/_queries/admin/suspend-admin";
import { Spinner } from "@/components/reuseables/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminModalStore } from "@/lib/store/admins/use-admins-modal-store";
import { toastSuccess } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export function SuspendAdminModal() {
  const [reason, setReason] = useState("");

  const { adminModal, closeAdminModal } = useAdminModalStore((s) => s);

  const { mutateAsync: suspendAdmin, isPending } = useSuspendAdmin();

  const open = adminModal?.type === "suspend-admin";
  const admin_id = adminModal?.admin_id;

  const shouldFetchAdmin = open && Boolean(admin_id);

  const { data, isError, isLoading, error } = useGetAdminById(admin_id!, {
    enabled: shouldFetchAdmin,
  });

  const admin_data = data?.data;

  if (!open) return null;
  if (isLoading) return null;

  if (isError || !admin_data) {
    return (
      <Dialog open={open} onOpenChange={closeAdminModal}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
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
      await suspendAdmin({ admin_id, reason });
      toastSuccess("Admin suspended successfully");
      handleClose();
    } catch {
      // Error toast handled in API file
    }
  };

  const handleClose = () => {
    setReason("");
    closeAdminModal();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isPending) handleClose();
      }}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Suspend Admin
          </DialogTitle>
          <DialogDescription>
            This action will suspend {admin_data.name}&apos;s account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            ⚠️ Once suspended, {admin_data.name} will lose access to admin
            activities and protected routes immediately
          </div>

          <div className="rounded-md border p-3">
            <p className="text-sm font-medium">{admin_data.name}</p>
            <p className="text-xs text-muted-foreground">{admin_data.email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspend-reason">Reason (optional)</Label>
            <Textarea
              id="suspend-reason"
              placeholder="Why are you suspending this admin?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isPending}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirm}
              disabled={isPending}>
              {isPending && <Spinner />}
              {isPending ? "Suspending..." : "Suspend"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
