"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import {
  acceptInviteAction,
  type ActionState,
} from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AcceptInviteForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, pending] = useActionState(
    acceptInviteAction,
    {} as ActionState,
  );

  if (!token) {
    return (
      <p className="text-sm text-red-700">
        This invite link is missing a token. Ask an admin to send a new invite.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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
        {pending ? "Creating account…" : "Accept invite"}
      </Button>
    </form>
  );
}
