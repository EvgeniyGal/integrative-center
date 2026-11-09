"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export function AddTeamMemberButton({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      type="button"
      className={className}
      onClick={() => {
        router.push(`/admin/team-members/new?t=${Date.now()}`);
      }}
    >
      Add team member
    </Button>
  );
}

export function BackToTeamMembersLink(
  props: Omit<ComponentProps<typeof Link>, "href">,
) {
  const router = useRouter();

  return (
    <Link
      href="/admin/team-members"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        router.push("/admin/team-members");
        router.refresh();
      }}
    />
  );
}
