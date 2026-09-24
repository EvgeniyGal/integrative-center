"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ImageIcon, Link2, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { generateServiceDraftAction } from "@/app/admin/actions/ai";
import {
  createServiceAction,
  updateServiceAction,
  type ServiceActionState,
} from "@/app/admin/actions/services";
import type { ActionState } from "@/app/admin/actions/auth";
import { uploadAdminImageAction } from "@/app/admin/actions/media";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import {
  ServiceDetailPreview,
  ServiceHomePreview,
} from "@/components/admin/ContentPreviews";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleBlock } from "@/lib/content/blocks";
import { safeParseMarkdown } from "@/lib/content/markdown";
import {
  normalizeServiceBody,
  serviceBodyToMarkdown,
} from "@/lib/content/service-body";
import type { Service } from "@/lib/db/schema";

function insertAtCursor(
  value: string,
  start: number,
  end: number,
  insertion: string,
) {
  return {
    next: `${value.slice(0, start)}${insertion}${value.slice(end)}`,
    caret: start + insertion.length,
  };
}

function InsertDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmLabel,
  confirmDisabled,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmLabel: string;
  confirmDisabled?: boolean;
  onCancel?: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100%-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 border border-ink/10 bg-ivory p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-display text-2xl text-ink">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1 text-muted transition hover:bg-ink/5 hover:text-ink"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-4 space-y-4">{children}</div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onCancel?.();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={confirmDisabled}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ServiceEditor({ service }: { service?: Service }) {
  const router = useRouter();
  const id = service?.id ?? "new";
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const bodyImageRef = useRef<HTMLInputElement>(null);

  const initialBlocks = useMemo(
    () => normalizeServiceBody(service?.body),
    [service?.body],
  );

  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [eyebrow, setEyebrow] = useState(service?.eyebrow ?? "");
  const [summary, setSummary] = useState(service?.summary ?? "");
  const [seoTitle, setSeoTitle] = useState(service?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    service?.seoDescription ?? "",
  );
  const [bodyMarkdown, setBodyMarkdown] = useState(() =>
    serviceBodyToMarkdown(service?.body),
  );
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState(service?.imageUrl ?? "");
  const [lastGoodBlocks, setLastGoodBlocks] =
    useState<ArticleBlock[]>(initialBlocks);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploading, startImageUpload] = useTransition();
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkLabel, setLinkLabel] = useState("Learn more");
  const [linkHref, setLinkHref] = useState("https://");
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState(
    "https://www.youtube.com/watch?v=",
  );
  const imageAltOpen = Boolean(pendingImage);

  const action = service ? updateServiceAction : createServiceAction;
  const [state, formAction, pending] = useActionState(
    action,
    {} as ServiceActionState,
  );
  const [aiState, aiAction, aiPending] = useActionState(
    generateServiceDraftAction,
    {} as ActionState & {
      draft?: {
        title: string;
        slug: string;
        eyebrow: string;
        summary: string;
        bodyMarkdown: string;
      };
    },
  );

  const parseResult = useMemo(
    () => safeParseMarkdown(bodyMarkdown),
    [bodyMarkdown],
  );

  useEffect(() => {
    if (parseResult.ok) {
      setLastGoodBlocks(parseResult.blocks);
    }
  }, [parseResult]);

  const blocksForSave = JSON.stringify(
    parseResult.ok ? parseResult.blocks : lastGoodBlocks,
  );
  const previewBlocks = parseResult.ok ? parseResult.blocks : lastGoodBlocks;

  useEffect(() => {
    if (aiState.draft) {
      setTitle(aiState.draft.title);
      setSlug(aiState.draft.slug);
      setEyebrow(aiState.draft.eyebrow);
      setSummary(aiState.draft.summary);
      setBodyMarkdown(aiState.draft.bodyMarkdown);
    }
  }, [aiState.draft]);

  useEffect(() => {
    if (state.imageUrl) {
      setImageUrl(state.imageUrl);
    }
  }, [state.imageUrl]);

  useEffect(() => {
    if (!service && state.success) {
      router.push("/admin/services");
      router.refresh();
    }
  }, [service, state.success, router]);

  const imageReady = Boolean(imageUrl) && !imageUrl.startsWith("blob:");

  function applyInsertion(insertion: string) {
    const el = markdownRef.current;
    const start = el?.selectionStart ?? bodyMarkdown.length;
    const end = el?.selectionEnd ?? bodyMarkdown.length;
    const { next, caret } = insertAtCursor(bodyMarkdown, start, end, insertion);
    setBodyMarkdown(next);
    requestAnimationFrame(() => {
      if (!markdownRef.current) return;
      markdownRef.current.focus();
      markdownRef.current.setSelectionRange(caret, caret);
    });
  }

  function openLinkModal() {
    const selected = markdownRef.current
      ? bodyMarkdown.slice(
          markdownRef.current.selectionStart,
          markdownRef.current.selectionEnd,
        )
      : "";
    setLinkLabel(selected.trim() || "Learn more");
    setLinkHref("https://");
    setLinkOpen(true);
  }

  function confirmLink() {
    const label = linkLabel.trim() || "Learn more";
    const href = linkHref.trim();
    if (!href) return;
    applyInsertion(`[${label}](${href})`);
    setLinkOpen(false);
  }

  function openYoutubeModal() {
    setYoutubeUrl("https://www.youtube.com/watch?v=");
    setYoutubeOpen(true);
  }

  function confirmYoutube() {
    const url = youtubeUrl.trim();
    if (!url) return;
    applyInsertion(`\n\n${url}\n\n`);
    setYoutubeOpen(false);
  }

  function insertImage() {
    setImageUploadError(null);
    bodyImageRef.current?.click();
  }

  function onBodyImageSelected(file: File | null) {
    if (!file) return;
    setPendingImage(file);
    setImageAlt("");
    if (bodyImageRef.current) bodyImageRef.current.value = "";
  }

  function confirmBodyImage() {
    if (!pendingImage) return;
    const file = pendingImage;
    const alt = imageAlt.trim() || "Service image";
    setPendingImage(null);
    startImageUpload(async () => {
      setImageUploadError(null);
      const fd = new FormData();
      fd.set("image", file);
      fd.set("folder", "services");
      const result = await uploadAdminImageAction(fd);
      if (result.error || !result.url) {
        setImageUploadError(result.error ?? "Image upload failed.");
        return;
      }
      applyInsertion(`\n\n![${alt}](${result.url})\n\n`);
    });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
      <div className="space-y-5">
        <form
          action={aiAction}
          className="space-y-4 border border-dashed border-brand/35 bg-brand-light/25 p-5"
        >
          <div className="space-y-1">
            <h3 className="font-display text-xl text-ink">AI draft assist</h3>
            <p className="text-sm text-muted">
              Paste your notes. AI formats them as Markdown (headings, lists,
              quotes, images, video) without rewriting your wording — review
              before saving.
            </p>
          </div>
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="imageUrls" value={imageUrl} />
          <input type="hidden" name="fallbackBody" value={bodyMarkdown} />
          <AdminField label="Notes" htmlFor={`notes-${id}`}>
            <Textarea
              id={`notes-${id}`}
              name="notes"
              variant="box"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Paste the service copy to format. Leave blank to format the Markdown body below."
            />
          </AdminField>
          {aiState.error ? (
            <p className="text-sm text-red-700">{aiState.error}</p>
          ) : null}
          {aiState.success ? (
            <p className="text-sm text-brand-dark">{aiState.success}</p>
          ) : null}
          <Button type="submit" variant="outline" size="sm" disabled={aiPending}>
            {aiPending ? "Generating…" : "Generate draft"}
          </Button>
        </form>

        <form action={formAction} className="space-y-5">
          {service ? <input type="hidden" name="id" value={service.id} /> : null}
          <input type="hidden" name="bodyMarkdown" value={bodyMarkdown} />
          <input type="hidden" name="blocks" value={blocksForSave} />

          <AdminSection
            title="Basics"
            description="Name and URL used across the public site."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Title" htmlFor={`title-${id}`}>
                <Input
                  id={`title-${id}`}
                  name="title"
                  variant="box"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </AdminField>
              <AdminField
                label="Slug"
                htmlFor={`slug-${id}`}
                hint="Leave blank to auto-generate"
              >
                <Input
                  id={`slug-${id}`}
                  name="slug"
                  variant="box"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="iv-therapy"
                />
              </AdminField>
            </div>
            <AdminField label="Eyebrow" htmlFor={`eyebrow-${id}`}>
              <Input
                id={`eyebrow-${id}`}
                name="eyebrow"
                variant="box"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                required
                placeholder="Short label above the title"
              />
            </AdminField>
          </AdminSection>

          <AdminSection
            title="Content"
            description="Summary appears on cards. Body is Markdown — same dialect as news."
          >
            <AdminField label="Summary" htmlFor={`summary-${id}`}>
              <Textarea
                id={`summary-${id}`}
                name="summary"
                variant="box"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                rows={3}
              />
            </AdminField>

            <div className="flex flex-wrap gap-2 rounded-sm border border-brand/25 bg-brand-light/30 p-2">
              <Button type="button" size="sm" onClick={openLinkModal}>
                <Link2 className="size-3.5" />
                Link
              </Button>
              <Button type="button" size="sm" onClick={openYoutubeModal}>
                <Video className="size-3.5" />
                YouTube
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={insertImage}
                disabled={imageUploading}
              >
                <ImageIcon className="size-3.5" />
                {imageUploading ? "Uploading…" : "Image"}
              </Button>
              <input
                ref={bodyImageRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  onBodyImageSelected(event.target.files?.[0] ?? null)
                }
              />
            </div>
            {imageUploadError ? (
              <p className="text-sm text-red-700">{imageUploadError}</p>
            ) : null}

            <InsertDialog
              open={linkOpen}
              onOpenChange={setLinkOpen}
              title="Insert link"
              description="Add a label and destination URL."
              onConfirm={confirmLink}
              confirmLabel="Insert link"
              confirmDisabled={!linkLabel.trim() || !linkHref.trim()}
            >
              <AdminField label="Label" htmlFor={`link-label-${id}`}>
                <Input
                  id={`link-label-${id}`}
                  variant="box"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  placeholder="Learn more"
                  autoFocus
                />
              </AdminField>
              <AdminField label="URL" htmlFor={`link-href-${id}`}>
                <Input
                  id={`link-href-${id}`}
                  variant="box"
                  value={linkHref}
                  onChange={(e) => setLinkHref(e.target.value)}
                  placeholder="https://"
                />
              </AdminField>
            </InsertDialog>

            <InsertDialog
              open={youtubeOpen}
              onOpenChange={setYoutubeOpen}
              title="Insert YouTube video"
              description="Paste a YouTube watch or share URL."
              onConfirm={confirmYoutube}
              confirmLabel="Insert video"
              confirmDisabled={!youtubeUrl.trim()}
            >
              <AdminField label="YouTube URL" htmlFor={`youtube-url-${id}`}>
                <Input
                  id={`youtube-url-${id}`}
                  variant="box"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v="
                  autoFocus
                />
              </AdminField>
            </InsertDialog>

            <InsertDialog
              open={imageAltOpen}
              onOpenChange={(open) => {
                if (!open) setPendingImage(null);
              }}
              title="Image alt text"
              description="Describe the image for accessibility."
              onConfirm={confirmBodyImage}
              confirmLabel="Insert image"
              confirmDisabled={!imageAlt.trim()}
              onCancel={() => setPendingImage(null)}
            >
              {pendingImage ? (
                <p className="truncate text-xs text-muted">
                  {pendingImage.name}
                </p>
              ) : null}
              <AdminField label="Alt text" htmlFor={`image-alt-${id}`}>
                <Input
                  id={`image-alt-${id}`}
                  variant="box"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Short description of the image"
                  autoFocus
                />
              </AdminField>
            </InsertDialog>

            <AdminField label="Markdown body" htmlFor={`markdown-${id}`}>
              <Textarea
                ref={markdownRef}
                id={`markdown-${id}`}
                variant="box"
                value={bodyMarkdown}
                onChange={(e) => setBodyMarkdown(e.target.value)}
                rows={16}
                className="min-h-64 font-mono text-sm"
                placeholder={`## What to expect\n\nPaste your service copy here.\n\n- Benefit one\n- Benefit two\n\nhttps://www.youtube.com/watch?v=VIDEO_ID`}
              />
            </AdminField>
            {!parseResult.ok ? (
              <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Markdown error: {parseResult.error}
              </p>
            ) : null}
          </AdminSection>

          <AdminSection
            title="Media"
            description="Main image for service cards and detail pages."
          >
            <ImageField
              label="Service image"
              urlName="imageUrl"
              uploadFolder="services"
              value={imageUrl}
              onChange={setImageUrl}
              required={!service}
            />
          </AdminSection>

          <AdminSection
            title="Visibility"
            description="SEO overrides and where this service appears."
          >
            <AdminField label="SEO title" htmlFor={`seo-title-${id}`}>
              <Input
                id={`seo-title-${id}`}
                name="seoTitle"
                variant="box"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Optional — defaults to service title"
              />
            </AdminField>
            <AdminField label="SEO description" htmlFor={`seo-desc-${id}`}>
              <Textarea
                id={`seo-desc-${id}`}
                name="seoDescription"
                variant="box"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="Optional — defaults to summary"
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr_1fr]">
              <AdminField label="Sort order" htmlFor={`sort-${id}`}>
                <Input
                  id={`sort-${id}`}
                  name="sortOrder"
                  variant="box"
                  type="number"
                  defaultValue={String(service?.sortOrder ?? 0)}
                />
              </AdminField>
              <AdminToggle
                name="visible"
                label="Visible"
                description="Show on the public services page"
                defaultChecked={service?.visible ?? true}
              />
              <AdminToggle
                name="showOnHome"
                label="Show on home"
                description="Include in homepage service cards"
                defaultChecked={service?.showOnHome ?? false}
              />
            </div>
          </AdminSection>

          {state.error ? (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          ) : null}
          {state.success ? (
            <p className="border border-brand/20 bg-brand-light/40 px-3 py-2 text-sm text-brand-dark">
              {state.success}
            </p>
          ) : null}

          <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 border border-ink/10 bg-ivory/95 px-4 py-3 shadow-[0_-8px_24px_rgba(28,27,25,0.06)] backdrop-blur">
            <p className="text-xs text-muted">
              {!service && imageUrl.startsWith("blob:")
                ? "Wait for the image upload to finish…"
                : !service && !imageReady
                  ? "Add a service image before saving."
                  : "Changes apply after you save."}
            </p>
            <Button
              type="submit"
              disabled={
                pending ||
                (!service && !imageReady) ||
                !parseResult.ok
              }
            >
              {pending
                ? "Saving…"
                : service
                  ? "Update service"
                  : "Create service"}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <ServiceHomePreview
          title={title}
          eyebrow={eyebrow}
          summary={summary}
          imageUrl={imageUrl}
        />
        <ServiceDetailPreview
          title={title}
          eyebrow={eyebrow}
          summary={summary}
          body={previewBlocks}
          imageUrl={imageUrl}
        />
      </div>
    </div>
  );
}
