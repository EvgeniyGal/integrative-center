"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export function AddSupplementBrandButton({
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
        router.push(`/admin/supplement-brands/new?t=${Date.now()}`);
      }}
    >
      Add brand
    </Button>
  );
}

export function BackToSupplementBrandsLink(
  props: Omit<ComponentProps<typeof Link>, "href">,
) {
  const router = useRouter();

  return (
    <Link
      href="/admin/supplement-brands"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        router.push("/admin/supplement-brands");
        router.refresh();
      }}
    />
  );
}
