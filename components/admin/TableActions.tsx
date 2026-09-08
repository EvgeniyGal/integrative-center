"use client";

import { Eye, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PreviewToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={cn(
        "border-ink/15",
        open && "border-brand text-brand",
      )}
      onClick={onToggle}
      title={open ? "Hide preview" : "Preview"}
      aria-label={open ? "Hide preview" : "Preview"}
      aria-pressed={open}
    >
      {open ? <X className="size-4" /> : <Eye className="size-4" />}
    </Button>
  );
}

export function EditLink({ href }: { href: string }) {
  return (
    <Button
      asChild
      variant="outline"
      size="icon-sm"
      className="border-ink/15"
    >
      <Link href={href} title="Edit" aria-label="Edit">
        <Pencil className="size-4" />
      </Link>
    </Button>
  );
}

export function DeleteButton({
  action,
  id,
}: {
  action: (formData: FormData) => Promise<void> | void;
  id: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="outline"
        size="icon-sm"
        className="border-ink/15 text-red-700 hover:border-red-700 hover:text-red-800"
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}

export function usePreviewId() {
  const [previewId, setPreviewId] = useState<string | null>(null);

  function toggle(id: string) {
    setPreviewId((current) => (current === id ? null : id));
  }

  return { previewId, toggle, isOpen: (id: string) => previewId === id };
}
