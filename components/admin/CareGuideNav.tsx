"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export function AddCareGuideButton({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      type="button"
      className={className}
      onClick={() => {
        router.push(`/admin/care-guides/new?t=${Date.now()}`);
      }}
    >
      Add care guide
    </Button>
  );
}

export function BackToCareGuidesLink(
  props: Omit<ComponentProps<typeof Link>, "href">,
) {
  const router = useRouter();

  return (
    <Link
      href="/admin/care-guides"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        router.push("/admin/care-guides");
        router.refresh();
      }}
    />
  );
}
