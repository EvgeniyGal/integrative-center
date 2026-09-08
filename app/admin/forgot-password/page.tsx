"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  requestPasswordResetAction,
  type ActionState,
} from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    {} as ActionState,
  );

  return (
    <div className="mx-auto flex min-h-[80svh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-[11px] uppercase tracking-[0.28em] text-brand">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Reset password</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your admin email and we will send a reset link.
      </p>
      <form action={action} className="mt-8 space-y-4 border border-ink/10 bg-ivory p-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.success ? (
          <p className="text-sm text-brand-dark">{state.success}</p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </Button>
        <p className="text-center text-sm text-muted">
          <Link href="/admin/login" className="text-brand hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
