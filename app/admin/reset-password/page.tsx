"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";

import {
  resetPasswordAction,
  type ActionState,
} from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    {} as ActionState,
  );

  if (!token) {
    return (
      <p className="text-sm text-red-700">
        Reset token missing. Request a new link from the login page.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
        />
      </div>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success ? (
        <p className="text-sm text-brand-dark">{state.success}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Updating…" : "Update password"}
      </Button>
      <p className="text-center text-sm text-muted">
        <Link href="/admin/login" className="text-brand hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-[11px] uppercase tracking-[0.28em] text-brand">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Choose a new password</h1>
      <div className="mt-8 border border-ink/10 bg-ivory p-6">
        <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
