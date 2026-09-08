"use client";

import { useActionState } from "react";

import type { ActionState } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  className,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={className}>
      {children}
      {state.error ? (
        <p className="mt-3 text-sm text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="mt-3 text-sm text-brand-dark">{state.success}</p>
      ) : null}
      <Button type="submit" className="mt-4" disabled={pending}>
        {pending ? "Working…" : submitLabel}
      </Button>
    </form>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
