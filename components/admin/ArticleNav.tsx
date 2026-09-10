"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Opens /admin/news/new with a fresh query so the form remounts empty. */
export function AddArticleButton({
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
        router.push(`/admin/news/new?t=${Date.now()}`);
      }}
    >
      New article
    </Button>
  );
}

/** Navigate back to the list and drop the cached new-form entry. */
export function BackToNewsLink({
  children = "← Back to news",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("rounded-none", className)}
      onClick={() => {
        router.push("/admin/news");
        router.refresh();
      }}
    >
      {children}
    </Button>
  );
}
