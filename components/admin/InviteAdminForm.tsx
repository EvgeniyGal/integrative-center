"use client";

import { useActionState } from "react";

import {
  inviteAdminAction,
  type ActionState,
} from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteAdminForm() {
  const [state, action, pending] = useActionState(
    inviteAdminAction,
    {} as ActionState,
  );

  return (
    <form action={action} className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1.5">
          <Label htmlFor="invite-email" className="text-xs text-muted">
            Email
          </Label>
          <Input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="colleague@example.com"
            className="h-10"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          className="h-10 shrink-0 rounded-none px-5"
          disabled={pending}
        >
          {pending ? "Sending…" : "Send invite"}
        </Button>
      </div>
      {state.error ? (
        <p className="text-sm text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-brand-dark">{state.success}</p>
      ) : null}
    </form>
  );
}
