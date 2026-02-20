"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield } from "lucide-react";
import { useInviteAdmin } from "@/app/_queries/admin/invite-admin";
import { toastSuccess } from "@/lib/utils";
import { Spinner } from "@/components/reuseables/spinner";

interface InviteAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteAdminModal({
  open,
  onOpenChange,
}: InviteAdminModalProps) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string | null>(null);

  const { mutateAsync: inviteAdmin, isPending } = useInviteAdmin();

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateEmail(email);
    if (error) {
      setErrors(error);
      return;
    }

    try {
      await inviteAdmin({ email: email.trim() });

      toastSuccess("Invitation sent successfully");
      handleClose();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const handleClose = () => {
    setEmail("");
    setErrors(null);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isPending) handleClose();
      }}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Invite New Admin
          </DialogTitle>
          <DialogDescription>
            Enter the email address of the new admin. They will receive an email
            with login instructions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors) setErrors(null);
                }}
                className={`pl-10 ${errors ? "border-red-500" : ""}`}
                disabled={isPending}
              />
            </div>
            {errors && <p className="text-sm text-red-500">{errors}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Sending invitation..." : "Add Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
