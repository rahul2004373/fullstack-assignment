import React, { useState } from "react";
import { authApi } from "@/api/auth.api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("New password must be 8-16 characters long and include at least one uppercase letter and one special character");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.updatePassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setSuccess("Password has been changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        err.message ||
        "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8 mt-4">
      <Card className="bg-card border-border shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center mb-2">
            <KeyRound className="w-4.5 h-4.5" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
            Update Your Password
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Change your account login password. Please make sure it meets security requirements.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-xs font-medium text-foreground">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="bg-background border-border text-foreground text-sm h-9"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="newPassword" className="text-xs font-medium text-foreground">
                  New Password
                </Label>
                <span className="text-[10px] text-muted-foreground">8-16 chars, 1 uppercase, 1 special</span>
              </div>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-background border-border text-foreground text-sm h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background border-border text-foreground text-sm h-9"
              />
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-9 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating password...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
