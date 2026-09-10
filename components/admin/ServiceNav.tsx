"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

/** Opens /admin/services/new with a fresh query so the form remounts empty. */
export function AddServiceButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();

  return (
    <Button
      type="button"
      className={className}
      onClick={() => {
        router.push(`/admin/services/new?t=${Date.now()}`);
      }}
    >
      Add service
    </Button>
  );
}

/** Navigate back to the list and drop the cached new-form entry. */
export function BackToServicesLink(
  props: Omit<ComponentProps<typeof Link>, "href">,
) {
  const router = useRouter();

  return (
    <Link
      href="/admin/services"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        router.push("/admin/services");
        router.refresh();
      }}
    />
  );
}
