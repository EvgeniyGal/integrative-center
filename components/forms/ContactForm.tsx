"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { submitContactAction } from "@/app/(site)/actions/inquiries";
import type { ActionState } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactFields = {
  first: string;
  last: string;
  phone: string;
  email: string;
  message: string;
};

type FieldKey = keyof ContactFields;
type FieldErrors = Partial<Record<FieldKey | "turnstile", string>>;

const emptyFields: ContactFields = {
  first: "",
  last: "",
  phone: "",
  email: "",
  message: "",
};

function validateFields(fields: ContactFields, token: string | null): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.first.trim()) {
    errors.first = "Please enter your first name.";
  }
  if (!fields.last.trim()) {
    errors.last = "Please enter your last name.";
  }
  if (!fields.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (fields.phone.trim().length < 7) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!fields.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.message.trim()) {
    errors.message = "Please enter a message.";
  }
  if (!token) {
    errors.turnstile = "Please complete the security check.";
  }

  return errors;
}

function FieldHint({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}

export function ContactForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    {} as ActionState,
  );
  const [fields, setFields] = useState<ContactFields>(emptyFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const previousError = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.error && state.error !== previousError.current) {
      setToken(null);
      turnstileRef.current?.reset();
    }
    previousError.current = state.error;
  }, [state.error]);

  function updateField<K extends FieldKey>(key: K, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors = validateFields(fields, token);
    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      setErrors(nextErrors);
    }
  }

  if (state.success) {
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

  if (!turnstileSiteKey) {
    return (
      <div className={cn("space-y-3", className)}>
        <p className="text-sm text-red-700">
          Contact form verification is not configured. Please try again later
          or call the office.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className={cn("relative space-y-6", className)}
      noValidate
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first">First name</Label>
          <Input
            id="first"
            name="first"
            autoComplete="given-name"
            required
            value={fields.first}
            onChange={(event) => updateField("first", event.target.value)}
            aria-invalid={Boolean(errors.first)}
            aria-describedby={errors.first ? "first-error" : undefined}
            className={fieldClass}
          />
          <FieldHint id="first-error" message={errors.first} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last">Last name</Label>
          <Input
            id="last"
            name="last"
            autoComplete="family-name"
            required
            value={fields.last}
            onChange={(event) => updateField("last", event.target.value)}
            aria-invalid={Boolean(errors.last)}
            aria-describedby={errors.last ? "last-error" : undefined}
            className={fieldClass}
          />
          <FieldHint id="last-error" message={errors.last} />
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
          value={fields.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={fieldClass}
        />
        <FieldHint id="phone-error" message={errors.phone} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={fieldClass}
        />
        <FieldHint id="email-error" message={errors.email} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={fieldClass}
        />
        <FieldHint id="message-error" message={errors.message} />
      </div>
      <div className="space-y-2">
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          options={{ theme: "light" }}
          onSuccess={(value) => {
            setToken(value);
            setErrors((current) => {
              if (!current.turnstile) return current;
              const next = { ...current };
              delete next.turnstile;
              return next;
            });
          }}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
        />
        <input type="hidden" name="cf-turnstile-response" value={token ?? ""} />
        <FieldHint id="turnstile-error" message={errors.turnstile} />
      </div>
      {state.error ? (
        <p className="text-sm text-red-700">{state.error}</p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

const fieldClass =
  "border border-stone bg-white px-4 shadow-[inset_0_1px_2px_rgba(28,27,25,0.04)] focus:border-brand focus:ring-1 focus:ring-brand/25";
