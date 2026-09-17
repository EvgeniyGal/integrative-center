"use client";

import { useActionState } from "react";

import { submitNewsletterAction } from "@/app/(site)/actions/inquiries";
import type { ActionState } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  compact = false,
  light = false,
  footer = false,
}: {
  compact?: boolean;
  light?: boolean;
  footer?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    submitNewsletterAction,
    {} as ActionState,
  );

  if (state.success) {
    return (
      <p className={cn("text-sm", light || footer ? "text-ivory/80" : "text-muted")}>
        You are on the list. Welcome.
      </p>
    );
  }

  if (footer) {
    return (
      <form action={formAction} className="w-full" noValidate>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
          <div>
            <label
              htmlFor="newsletter-first-name"
              className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-ivory/85"
            >
              First name
            </label>
            <Input
              id="newsletter-first-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              className="h-10 border-white/35 text-ivory placeholder:text-ivory/30 focus:border-brand-light"
            />
          </div>
          <div>
            <label
              htmlFor="newsletter-last-name"
              className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-ivory/85"
            >
              Last name
            </label>
            <Input
              id="newsletter-last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              className="h-10 border-white/35 text-ivory placeholder:text-ivory/30 focus:border-brand-light"
            />
          </div>
          <div>
            <label
              htmlFor="newsletter-email"
              className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-ivory/85"
            >
              E-mail (required)
            </label>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-10 border-white/35 text-ivory placeholder:text-ivory/30 focus:border-brand-light"
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            type="submit"
            variant="inverted"
            className="min-w-[12rem] uppercase tracking-[0.18em]"
            disabled={pending}
          >
            {pending ? "Sending…" : "Subscribe"}
          </Button>
          {state.error ? (
            <p className="text-xs text-red-300">{state.error}</p>
          ) : null}
        </div>
      </form>
    );
  }

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-3", compact ? "" : "sm:flex-row sm:items-end")}
      noValidate
    >
      <div className="flex-1">
        {!compact ? (
          <label
            htmlFor="newsletter-email"
            className={cn(
              "mb-2 block text-[11px] uppercase tracking-[0.22em]",
              light ? "text-ivory/60" : "text-muted",
            )}
          >
            Email
          </label>
        ) : null}
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="you@email.com"
          required
          className={cn(
            compact && "h-10 text-sm",
            light && "border-white/25 text-ivory placeholder:text-ivory/40 focus:border-brand-light",
          )}
        />
      </div>
      <Button
        type="submit"
        variant={light ? "inverted" : "default"}
        size={compact ? "sm" : "default"}
        disabled={pending}
      >
        {pending ? "Sending…" : "Subscribe"}
      </Button>
      {state.error ? (
        <p className={cn("text-xs", light ? "text-red-300" : "text-red-600")}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
