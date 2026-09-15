"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export function AddRecommendedProductButton({
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
        router.push(`/admin/recommended-products/new?t=${Date.now()}`);
      }}
    >
      Add product
    </Button>
  );
}

export function BackToRecommendedProductsLink(
  props: Omit<ComponentProps<typeof Link>, "href">,
) {
  const router = useRouter();

  return (
    <Link
      href="/admin/recommended-products"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        router.push("/admin/recommended-products");
        router.refresh();
      }}
    />
  );
}
