"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DocumentBlockItem } from "@/lib/content/blocks";

export function DocumentsBlock({
  items,
  className = "",
}: {
  items: DocumentBlockItem[];
  className?: string;
}) {
  const [active, setActive] = useState<DocumentBlockItem | null>(null);

  if (!items?.length) return null;

  return (
    <>
      <div
        className={`flex flex-wrap justify-center gap-4 ${className}`.trim()}
      >
        {items.map((item, index) => (
          <button
            key={`${item.url}-${index}`}
            type="button"
            onClick={() => setActive(item)}
            className="group flex w-full max-w-xs flex-col border border-ink/15 bg-white px-5 py-5 text-left transition hover:border-brand/40 hover:bg-brand-light/20 sm:w-[14rem]"
          >
            <span className="inline-flex size-10 items-center justify-center bg-brand-light/50 text-brand transition group-hover:bg-brand group-hover:text-ivory">
              <FileText className="size-5" aria-hidden />
            </span>
            <span className="mt-4 font-display text-xl leading-snug text-ink text-balance">
              {item.title}
            </span>
            {item.description ? (
              <span className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </span>
            ) : null}
            <span className="mt-4 text-[11px] uppercase tracking-[0.22em] text-brand">
              View PDF
            </span>
          </button>
        ))}
      </div>

      <Dialog.Root
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-3 z-50 flex flex-col overflow-hidden border border-ink/10 bg-ivory shadow-2xl focus:outline-none sm:inset-6 lg:inset-10">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-ink/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <Dialog.Title className="truncate font-display text-2xl text-ink sm:text-3xl">
                  {active?.title ?? "Document"}
                </Dialog.Title>
                {active?.description ? (
                  <Dialog.Description className="mt-1 line-clamp-2 text-sm text-muted">
                    {active.description}
                  </Dialog.Description>
                ) : (
                  <Dialog.Description className="sr-only">
                    PDF document preview
                  </Dialog.Description>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {active?.url ? (
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={active.url}
                      download={active.fileName || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="size-3.5" />
                      Download
                    </a>
                  </Button>
                ) : null}
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-full p-2 text-muted transition hover:bg-ink/5 hover:text-ink"
                    aria-label="Close preview"
                  >
                    <X className="size-5" />
                  </button>
                </Dialog.Close>
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-stone/40">
              {active?.url ? (
                <iframe
                  src={active.url}
                  title={active.title}
                  className="h-full w-full border-0"
                />
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
