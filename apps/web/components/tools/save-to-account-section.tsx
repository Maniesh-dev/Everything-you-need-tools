"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

interface SaveToAccountSectionProps {
  user: { email: string } | null;
  isLoading: boolean;
  signupHref: string;
  loginHref: string;
  onSave: () => void;
  saveDisabled: boolean;
  isSaving: boolean;
  saveLabel?: string;
  savingLabel?: string;
  idleHint?: string | null;
  readyHint?: string | null;
  error?: string | null;
  success?: string | null;
}

export function SaveToAccountSection({
  user,
  isLoading,
  signupHref,
  loginHref,
  onSave,
  saveDisabled,
  isSaving,
  saveLabel = "Save File",
  savingLabel = "Saving...",
  idleHint,
  readyHint,
  error,
  success,
}: SaveToAccountSectionProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
      <p className="text-sm font-medium">Save this file to your account</p>

      {!isLoading && !user && (
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href={signupHref}>Want to save this file? Sign up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={loginHref}>Login</Link>
          </Button>
        </div>
      )}

      {!isLoading && user && (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={onSave} disabled={saveDisabled}>
            {isSaving ? savingLabel : saveLabel}
          </Button>
          <span className="text-xs text-muted-foreground">
            Signed in as {user.email}
          </span>
        </div>
      )}

      {isLoading && (
        <Button type="button" variant="outline" disabled>
          Checking account...
        </Button>
      )}

      {user && idleHint && <p className="text-xs text-muted-foreground">{idleHint}</p>}
      {readyHint && <p className="text-xs text-muted-foreground">{readyHint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}
    </div>
  );
}
