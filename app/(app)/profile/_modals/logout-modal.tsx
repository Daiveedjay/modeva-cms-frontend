"use client";

import { useAdminLogout } from "@/app/_queries/admin/admin-logout";
import { Spinner } from "@/components/reuseables/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toastSuccess } from "@/lib/utils";
import { AlertCircle, LogOut } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  close: () => void;
}

export function LogoutModal({ open, close }: LogoutModalProps) {
  const { mutateAsync: adminLogout, isPending } = useAdminLogout();

  const handleLogout = async () => {
    try {
      await adminLogout();

      toastSuccess("Logged out successfully");
      close();
      // Router navigation happens in API file onSuccess
    } catch {
      // Error toast handled in API file
      // Router navigation happens in API file onError (even on error)
      close();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isPending) close();
      }}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-semibold">Log Out</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to log out? You&apos;ll need to sign back in
            to access your account.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Any unsaved changes will be lost.
          </p>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={close} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isPending}
            className="gap-2">
            {isPending ? (
              <>
                <Spinner />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Log Out
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
