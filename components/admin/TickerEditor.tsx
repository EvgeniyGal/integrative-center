"use client";

import { useActionState, useState } from "react";

import { saveTickerTextAction } from "@/app/admin/actions/ticker";
import type { ActionState } from "@/app/admin/actions/auth";
import { AdminField, AdminSection } from "@/components/admin/AdminField";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TickerEditor({ initialText }: { initialText: string }) {
  const [text, setText] = useState(initialText);
  const [state, formAction, pending] = useActionState(
    saveTickerTextAction,
    {} as ActionState,
  );

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      <AdminSection
        title="Announcement bar"
        description="One string scrolls in the brand bar under the header. Use • or spaces to separate phrases."
      >
        <AdminField label="Ticker text" htmlFor="ticker-text">
          <Textarea
            id="ticker-text"
            name="tickerText"
            variant="box"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            className="min-h-28 font-medium uppercase tracking-[0.12em]"
            placeholder="Fully licensed in FL • MA • IL • Telehealth Available"
          />
        </AdminField>
      </AdminSection>

      {state.error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="border border-brand/20 bg-brand-light/40 px-3 py-2 text-sm text-brand-dark">
          {state.success}
        </p>
      ) : null}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 border border-ink/10 bg-ivory/95 px-4 py-3 shadow-[0_-8px_24px_rgba(28,27,25,0.06)] backdrop-blur">
        <p className="text-xs text-muted">Changes apply after you save.</p>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save ticker"}
        </Button>
      </div>
    </form>
  );
}
