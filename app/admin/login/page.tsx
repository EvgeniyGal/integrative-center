import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-[11px] uppercase tracking-[0.28em] text-brand">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Access is invite-only. Use the email and password for your admin account.
      </p>
      <div className="mt-8 rounded-none border border-ink/10 bg-ivory p-6">
        <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
