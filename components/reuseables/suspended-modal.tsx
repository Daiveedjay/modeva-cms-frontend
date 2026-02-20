"use client";

import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuspendedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

export function SuspendedModal({
  isOpen,
  onClose,
  onDismiss,
}: SuspendedModalProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear token and redirect to home
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      document.cookie =
        "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
    onDismiss(); // Persist dismissal
    router.push("/");
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle className="text-xl">Account Suspended</DialogTitle>
            </div>
            <DialogDescription className="mt-4 flex flex-col space-y-3 text-base">
              <span>
                Your admin account has been suspended by a super administrator.
              </span>
              <span className="text-sm text-muted-foreground">
                If you believe this is a mistake, please contact your super
                admin.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              onClick={handleLogout}
              className="bg-destructive text-foreground hover:bg-destructive/90">
              Return to Home
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
