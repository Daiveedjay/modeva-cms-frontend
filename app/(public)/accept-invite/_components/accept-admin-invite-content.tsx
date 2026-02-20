"use client";

import { useAcceptAdminInvite } from "@/app/_queries/admin/accept-admin-invite";
import Logo from "@/components/reuseables/logo";
import { Spinner } from "@/components/reuseables/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toastSuccess } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function AcceptAdminInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: acceptInvite, isPending } = useAcceptAdminInvite();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!email || !token) return <InvalidTokenComponent />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("Name is required");
      return;
    }
    if (name.trim().length < 3) {
      setValidationError("Name must be at least 3 characters");
      return;
    }
    if (!password || password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    try {
      await acceptInvite({ email, token, name: name.trim(), password });
      toastSuccess("Account created successfully");
      setSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch {}
  };

  if (success) return <SuccessComponent />;
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold text-foreground">Welcome</span>
          </div>
          <p className="text-sm text-muted-foreground">Complete your setup</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Content Section */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3 text-balance">
              Complete your account
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              You&apos;ve been invited to join. Set up your account by creating
              a password and choosing your name.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm space-y-6">
            {/* Email Display */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email Address
              </p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border">
                <Mail className="h-4 w-4 text-primary/60" />
                <p className="text-sm text-foreground font-medium">{email}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                This email cannot be changed
              </p>
            </div>

            {/* Error Alert */}
            {validationError && (
              <Alert className="border-red-500/30 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {validationError}
                </AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  className="border text-foreground"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  At least 3 characters (excluding spaces)
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    className="border pr-10 text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isPending}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }>
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isPending}
                    className="border pr-10 text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isPending}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }>
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !name.trim() ||
                  !password.trim() ||
                  !confirmPassword.trim() ||
                  password !== confirmPassword
                }
                className="w-full mt-8 h-11 font-medium">
                {isPending ? (
                  <>
                    <Spinner />
                    Creating Account...
                  </>
                ) : (
                  "Accept Invitation"
                )}
              </Button>
            </form>

            {/* Footer Info */}
            <div className="pt-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                This invitation expires in 7 days
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            By completing your account, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

const InvalidTokenComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-red-500/20 bg-red-950/10 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-red-400">
            Invalid Invitation Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The invitation link is missing required parameters. Please check
              your email for the correct link.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

const SuccessComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Account Created!
          </h1>
          <p className="text-muted-foreground">
            Your admin account has been successfully set up.
          </p>
        </div>
        <div className="flex justify-center">
          <Spinner />
        </div>
        <p className="text-sm text-muted-foreground">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
};
