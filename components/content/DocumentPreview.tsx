"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DocumentBlockItem } from "@/lib/content/blocks";
import { loadPdfDocument, usePdfPage } from "@/lib/pdf";

function DocumentsGrid({
  count,
  className,
  children,
}: {
  count: number;
  className?: string;
  children: React.ReactNode;
}) {
  const cols =
    count <= 1
      ? "mx-auto max-w-xs grid-cols-1"
      : count === 2
        ? "mx-auto max-w-2xl grid-cols-2"
        : count === 3
          ? "mx-auto max-w-3xl grid-cols-3"
          : "mx-auto max-w-5xl grid-cols-4";

  return (
    <div className={`grid gap-5 sm:gap-6 ${cols} ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}

function PdfThumbnail({ url }: { url: string }) {
  const { canvasRef, status } = usePdfPage(url, 1, 360);

  return (
    <span className="relative mt-4 block aspect-[3/4] w-full overflow-hidden border border-ink/15 bg-stone/40 shadow-[0_8px_24px_rgba(28,27,25,0.08)] transition duration-500 group-hover:border-brand/35 group-hover:shadow-[0_12px_28px_rgba(28,27,25,0.12)]">
      {status === "loading" ? (
        <span className="absolute inset-0 animate-pulse bg-stone/50" />
      ) : null}
      {status === "error" ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-light/40 text-brand">
          <FileText className="size-10" strokeWidth={1.25} aria-hidden />
          <span className="text-[10px] uppercase tracking-[0.22em]">PDF</span>
        </span>
      ) : null}
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute left-1/2 top-0 max-h-none w-full -translate-x-1/2 bg-white ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-0 bottom-0 bg-ink/70 px-3 py-2 text-center text-[10px] uppercase tracking-[0.22em] text-ivory opacity-0 transition duration-500 group-hover:opacity-100">
        View PDF
      </span>
    </span>
  );
}

function DocumentTile({
  item,
  onOpen,
}: {
  item: DocumentBlockItem;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full min-w-0 cursor-pointer flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <span className="font-display text-lg leading-snug text-ink text-balance sm:text-xl">
        {item.title}
      </span>
      {item.description ? (
        <span className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">
          {item.description}
        </span>
      ) : null}
      <PdfThumbnail url={item.url} />
    </button>
  );
}

function PdfViewer({ url, title }: { url: string; title: string }) {
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPageCount(0);

    loadPdfDocument(url)
      .then((pdf) => {
        if (cancelled) return;
        setPageCount(pdf.numPages);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load this PDF in the browser.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        Loading document…
      </div>
    );
  }

  if (error || pageCount === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted">
          {error ?? "Preview unavailable on this device."}
        </p>
        <Button asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open PDF
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-stone/40 px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {Array.from({ length: pageCount }, (_, index) => (
          <PdfViewerPage
            key={`${url}-${index + 1}`}
            url={url}
            pageNumber={index + 1}
            title={title}
          />
        ))}
      </div>
    </div>
  );
}

function PdfViewerPage({
  url,
  pageNumber,
  title,
}: {
  url: string;
  pageNumber: number;
  title: string;
}) {
  const { canvasRef, status } = usePdfPage(url, pageNumber, 820);

  return (
    <div className="overflow-hidden border border-ink/10 bg-white shadow-[0_8px_24px_rgba(28,27,25,0.08)]">
      {status === "loading" ? (
        <div className="aspect-[3/4] animate-pulse bg-stone/40" />
      ) : null}
      {status === "error" ? (
        <div className="flex aspect-[3/4] items-center justify-center text-sm text-muted">
          Page {pageNumber} could not be rendered.
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        aria-label={`${title}, page ${pageNumber}`}
        className={`mx-auto block h-auto max-w-full ${
          status === "ready" ? "opacity-100" : "hidden"
        }`}
      />
    </div>
  );
}

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
      <DocumentsGrid count={items.length} className={className}>
        {items.map((item, index) => (
          <DocumentTile
            key={`${item.url}-${index}`}
            item={item}
            onOpen={() => setActive(item)}
          />
        ))}
      </DocumentsGrid>

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
            <div className="min-h-0 flex-1">
              {active?.url ? (
                <PdfViewer url={active.url} title={active.title} />
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
