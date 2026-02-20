"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAdminLogin } from "@/app/_queries/admin/admin-login";
import { toastSuccess } from "@/lib/utils";
import { Spinner } from "@/components/reuseables/spinner";

interface PrivilegedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

interface IntroContentProps {
  onLoginClick: () => void;
  onContinueAsWanderer: () => void;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
}

interface LoginContentProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

function IntroContent({
  onLoginClick,
  onContinueAsWanderer,
  dontShowAgain,
  setDontShowAgain,
}: IntroContentProps) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-2xl">✨ Exclusive Access</DialogTitle>
        <DialogDescription className="mt-4 text-base">
          <div className="space-y-3">
            <div>You reached admin area. Reserved access only.</div>
            <div className="font-semibold">Are you one of the chosen?</div>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 flex flex-col gap-3">
        <Button size="lg" onClick={onLoginClick}>
          🔐 Admin Login
        </Button>

        <Button variant="ghost" size="lg" onClick={onContinueAsWanderer}>
          🌍 Continue as Wanderer
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Checkbox
          id="dont-show"
          checked={dontShowAgain}
          onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
        />
        <Label
          htmlFor="dont-show"
          className="cursor-pointer text-xs text-muted-foreground">
          Don&apos;t show this again
        </Label>
      </div>
    </motion.div>
  );
}

function LoginContent({ onBack, onLoginSuccess }: LoginContentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: adminLogin, isPending } = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await adminLogin({ email: email.toLowerCase(), password });

      toastSuccess("Login successful");
      setEmail("");
      setPassword("");
      onLoginSuccess();
    } catch {
      // Error toast handled in API file
      // Keep form accessible so user can retry
    }
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-2xl">🔐 Admin Login</DialogTitle>
        <DialogDescription className="mt-4">
          Enter your credentials to access the admin dashboard
        </DialogDescription>
      </DialogHeader>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              disabled={isPending}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer">
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={isPending}>
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

export function PrivilegedModal({
  isOpen,
  onClose,
  onDismiss,
}: PrivilegedModalProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleBackdropOrXClose = () => {
    setShowLoginForm(false);
    onClose();
  };

  const handleContinueAsWanderer = () => {
    setShowLoginForm(false);
    if (dontShowAgain) {
      onDismiss();
    } else {
      onClose();
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginForm(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleBackdropOrXClose()}>
      <DialogContent className="max-w-sm">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {!showLoginForm ? (
              <IntroContent
                onLoginClick={handleLoginClick}
                onContinueAsWanderer={handleContinueAsWanderer}
                dontShowAgain={dontShowAgain}
                setDontShowAgain={setDontShowAgain}
              />
            ) : (
              <LoginContent
                onBack={() => setShowLoginForm(false)}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
