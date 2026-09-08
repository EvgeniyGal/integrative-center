import { Suspense } from "react";

import { AcceptInviteForm } from "@/components/admin/AcceptInviteForm";

export default function AcceptInvitePage() {
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-[11px] uppercase tracking-[0.28em] text-brand">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Accept invite</h1>
      <p className="mt-2 text-sm text-muted">
        Create your password to join the admin panel.
      </p>
      <div className="mt-8 border border-ink/10 bg-ivory p-6">
        <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
          <AcceptInviteForm />
        </Suspense>
      </div>
    </div>
  );
}
