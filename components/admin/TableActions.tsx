"use client";

import * as Dialog from "@radix-ui/react-dialog";
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
  disabled = false,
  disabledTitle = "Cannot delete while in use",
  label = "this item",
}: {
  action: (formData: FormData) => Promise<void> | void;
  id: string;
  disabled?: boolean;
  disabledTitle?: string;
  /** Shown in the confirmation copy, e.g. category name. */
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="border-ink/15 text-red-700 hover:border-red-700 hover:text-red-800"
          title={disabled ? disabledTitle : "Delete"}
          aria-label={disabled ? disabledTitle : "Delete"}
          disabled={disabled}
        >
          <Trash2 className="size-4" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 border border-ink/10 bg-ivory p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-display text-2xl text-ink">
                Delete permanently?
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted">
                This will permanently delete {label}. This action cannot be
                undone.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="shrink-0 border-ink/15"
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button type="button" variant="outline" className="rounded-none">
                Cancel
              </Button>
            </Dialog.Close>
            <form
              action={action}
              onSubmit={() => {
                setOpen(false);
              }}
            >
              <input type="hidden" name="id" value={id} />
              <Button
                type="submit"
                className="rounded-none bg-red-700 text-white shadow-none hover:bg-red-800"
              >
                Delete
              </Button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function usePreviewId() {
  const [previewId, setPreviewId] = useState<string | null>(null);

  function toggle(id: string) {
    setPreviewId((current) => (current === id ? null : id));
  }

  return { previewId, toggle, isOpen: (id: string) => previewId === id };
}
