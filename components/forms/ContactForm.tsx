"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ContactForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const first = String(data.get("first") ?? "").trim();
    const last = String(data.get("last") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!first || !last || !phone || !email || !message || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className={cn("border border-brand/20 bg-brand-light/40 p-10", className)}>
        <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
          Received
        </p>
        <h3 className="mt-4 font-display text-3xl text-ink">
          Thank you. We will be in touch shortly.
        </h3>
        <p className="mt-3 text-sm text-muted">
          A member of our team will review your note and follow up during
          business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)} noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first">First name</Label>
          <Input
            id="first"
            name="first"
            autoComplete="given-name"
            required
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last">Last name</Label>
          <Input
            id="last"
            name="last"
            autoComplete="family-name"
            required
            className={fieldClass}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required className={fieldClass} />
      </div>
      {status === "error" ? (
        <p className="text-sm text-red-700">
          Please complete every field with a valid email so we can reach you.
        </p>
      ) : null}
      <Button type="submit" size="lg">
        Send message
      </Button>
    </form>
  );
}

const fieldClass =
  "border border-stone bg-white px-4 shadow-[inset_0_1px_2px_rgba(28,27,25,0.04)] focus:border-brand focus:ring-1 focus:ring-brand/25";
