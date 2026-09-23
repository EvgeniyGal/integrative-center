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

import { generateArticleDraftAction } from "@/app/admin/actions/ai";
import {
  createArticleAction,
  updateArticleAction,
  type ArticleActionState,
} from "@/app/admin/actions/articles";
import type { ActionState } from "@/app/admin/actions/auth";
import { uploadAdminImageAction } from "@/app/admin/actions/media";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import {
  ArticleDetailPreview,
  ArticleHomePreview,
} from "@/components/admin/ContentPreviews";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleBlock } from "@/lib/content/blocks";
import {
  blocksToMarkdown,
  safeParseMarkdown,
} from "@/lib/content/markdown";
import type { Article } from "@/lib/db/schema";

const selectClassName =
  "h-12 w-full border border-ink/20 bg-white px-3 text-base text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

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

export function ArticleEditor({ article }: { article?: Article }) {
  const router = useRouter();
  const id = article?.id ?? "new";
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const bodyImageRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [category, setCategory] = useState(article?.category ?? "");
  const [tags, setTags] = useState((article?.tags ?? []).join(", "));
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    article?.seoDescription ?? "",
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    article?.coverImageUrl ?? "",
  );
  const [bodyMarkdown, setBodyMarkdown] = useState(() =>
    blocksToMarkdown(article?.blocks ?? []),
  );
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(article?.status ?? "draft");
  const [lastGoodBlocks, setLastGoodBlocks] = useState<ArticleBlock[]>(
    () => article?.blocks ?? [],
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploading, startImageUpload] = useTransition();
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkLabel, setLinkLabel] = useState("Read more");
  const [linkHref, setLinkHref] = useState("https://");
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState(
    "https://www.youtube.com/watch?v=",
  );
  const imageAltOpen = Boolean(pendingImage);

  const action = article ? updateArticleAction : createArticleAction;
  const [state, formAction, pending] = useActionState(
    action,
    {} as ArticleActionState,
  );
  const [aiState, aiAction, aiPending] = useActionState(
    generateArticleDraftAction,
    {} as ActionState & {
      draft?: {
        title: string;
        slug: string;
        excerpt: string;
        category: string;
        tags: string[];
        seoTitle: string;
        seoDescription: string;
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

  useEffect(() => {
    if (aiState.draft) {
      setTitle(aiState.draft.title);
      setSlug(aiState.draft.slug);
      setExcerpt(aiState.draft.excerpt);
      setCategory(aiState.draft.category);
      setTags(aiState.draft.tags.join(", "));
      setSeoTitle(aiState.draft.seoTitle);
      setSeoDescription(aiState.draft.seoDescription);
      setBodyMarkdown(aiState.draft.bodyMarkdown);
    }
  }, [aiState.draft]);

  useEffect(() => {
    if (!article && state.success) {
      router.push("/admin/news");
      router.refresh();
    }
  }, [article, state.success, router]);

  useEffect(() => {
    if (state.coverImageUrl) {
      setCoverImageUrl(state.coverImageUrl);
    }
  }, [state.coverImageUrl]);

  function applyInsertion(insertion: string) {
    setBodyMarkdown((current) => {
      const el = markdownRef.current;
      const start = el?.selectionStart ?? current.length;
      const end = el?.selectionEnd ?? current.length;
      const { next, caret } = insertAtCursor(current, start, end, insertion);
      requestAnimationFrame(() => {
        if (!markdownRef.current) return;
        markdownRef.current.focus();
        markdownRef.current.setSelectionRange(caret, caret);
      });
      return next;
    });
  }

  function openLinkModal() {
    setLinkLabel("Read more");
    setLinkHref("https://");
    setLinkOpen(true);
  }

  function confirmLink() {
    if (!linkLabel.trim() || !linkHref.trim()) return;
    applyInsertion(`[${linkLabel.trim()}](${linkHref.trim()})`);
    setLinkOpen(false);
  }

  function openYoutubeModal() {
    setYoutubeUrl("https://www.youtube.com/watch?v=");
    setYoutubeOpen(true);
  }

  function confirmYoutube() {
    if (!youtubeUrl.trim()) return;
    applyInsertion(`\n\n${youtubeUrl.trim()}\n\n`);
    setYoutubeOpen(false);
  }

  function insertImage() {
    setImageUploadError(null);
    bodyImageRef.current?.click();
  }

  function clearPendingImage() {
    setPendingImage(null);
    setImageAlt("");
    if (bodyImageRef.current) bodyImageRef.current.value = "";
  }

  function onBodyImageSelected(file: File | null) {
    if (!file) return;
    setPendingImage(file);
    setImageAlt(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
  }

  function confirmBodyImage() {
    if (!pendingImage) return;
    const file = pendingImage;
    const alt = imageAlt;
    clearPendingImage();

    startImageUpload(async () => {
      const formData = new FormData();
      formData.set("image", file);
      formData.set("folder", "articles/body");
      const result = await uploadAdminImageAction(formData);
      if (result.error || !result.url) {
        setImageUploadError(result.error ?? "Upload failed.");
        return;
      }
      applyInsertion(`\n\n![${alt.trim()}](${result.url})\n\n`);
    });
  }

  const canSave = parseResult.ok;
  const blocksForSave = parseResult.ok
    ? JSON.stringify(parseResult.blocks)
    : JSON.stringify(lastGoodBlocks);
  const previewBlocks = parseResult.ok ? parseResult.blocks : lastGoodBlocks;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)]">
      <div className="space-y-5">
        {!article ? (
          <form
            action={aiAction}
            className="space-y-4 border border-dashed border-brand/35 bg-brand-light/25 p-5"
          >
            <div className="space-y-1">
              <h3 className="font-display text-xl text-ink">AI draft assist</h3>
              <p className="text-sm text-muted">
                Provide notes. AI formats them as Markdown (sections, lists,
                quotes, images, video) without rewriting your wording — review
                before saving.
              </p>
            </div>
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="imageUrls" value={coverImageUrl} />
            <input type="hidden" name="fallbackBody" value={bodyMarkdown} />
            <AdminField label="Notes" htmlFor={`notes-${id}`}>
              <Textarea
                id={`notes-${id}`}
                name="notes"
                variant="box"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Paste the article copy to format. Leave blank to format the Markdown body below."
              />
            </AdminField>
            {aiState.error ? (
              <p className="text-sm text-red-700">{aiState.error}</p>
            ) : null}
            {aiState.success ? (
              <p className="text-sm text-brand-dark">{aiState.success}</p>
            ) : null}
            <Button type="submit" disabled={aiPending}>
              {aiPending ? "Generating…" : "Generate draft"}
            </Button>
          </form>
        ) : null}

        <form action={formAction} className="space-y-5">
          {article ? <input type="hidden" name="id" value={article.id} /> : null}
          <input type="hidden" name="bodyMarkdown" value={bodyMarkdown} />
          <input type="hidden" name="blocks" value={blocksForSave} />

          <AdminSection
            title="Basics"
            description="Title, URL, and listing copy."
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
                  placeholder="article-slug"
                  aria-invalid={
                    Boolean(state.error && /slug/i.test(state.error)) ||
                    undefined
                  }
                />
                {state.error && /slug/i.test(state.error) ? (
                  <p className="text-sm text-red-700">{state.error}</p>
                ) : null}
              </AdminField>
            </div>
            <AdminField label="Excerpt" htmlFor={`excerpt-${id}`}>
              <Textarea
                id={`excerpt-${id}`}
                name="excerpt"
                variant="box"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={3}
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Category" htmlFor={`category-${id}`}>
                <Input
                  id={`category-${id}`}
                  name="category"
                  variant="box"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </AdminField>
              <AdminField
                label="Tags"
                htmlFor={`tags-${id}`}
                hint="Comma-separated"
              >
                <Input
                  id={`tags-${id}`}
                  name="tags"
                  variant="box"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="hormones, wellness"
                />
              </AdminField>
            </div>
          </AdminSection>

          <AdminSection
            title="Publishing"
            description="Status, SEO, and homepage placement."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Status" htmlFor={`status-${id}`}>
                <select
                  id={`status-${id}`}
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={selectClassName}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </AdminField>
              <AdminToggle
                name="featuredOnHome"
                label="Feature on home"
                description="Show in homepage news cards"
                defaultChecked={article?.featuredOnHome ?? false}
              />
            </div>
            <AdminField label="SEO title" htmlFor={`seo-title-${id}`}>
              <Input
                id={`seo-title-${id}`}
                name="seoTitle"
                variant="box"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
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
              />
            </AdminField>
          </AdminSection>

          <AdminSection
            title="Cover image"
            description="Main image for news cards and the article header."
          >
            <ImageField
              label="Cover image"
              urlName="coverImageUrl"
              uploadFolder="articles"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              required={!article}
            />
          </AdminSection>

          <AdminSection
            title="Body"
            description="Write in Markdown. It is converted to structured blocks on save."
          >
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
                  placeholder="Read more"
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
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      confirmLink();
                    }
                  }}
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
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      confirmYoutube();
                    }
                  }}
                />
              </AdminField>
            </InsertDialog>

            <InsertDialog
              open={imageAltOpen}
              onOpenChange={(open) => {
                if (!open) clearPendingImage();
              }}
              title="Image alt text"
              description="Describe the image for accessibility. Optional but recommended."
              onConfirm={confirmBodyImage}
              confirmLabel="Insert image"
              onCancel={clearPendingImage}
            >
              {pendingImage ? (
                <p className="truncate text-xs text-muted">{pendingImage.name}</p>
              ) : null}
              <AdminField label="Alt text" htmlFor={`image-alt-${id}`}>
                <Input
                  id={`image-alt-${id}`}
                  variant="box"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Short description of the image"
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      confirmBodyImage();
                    }
                  }}
                />
              </AdminField>
            </InsertDialog>

            <AdminField label="Markdown" htmlFor={`markdown-${id}`}>
              <Textarea
                ref={markdownRef}
                id={`markdown-${id}`}
                variant="box"
                value={bodyMarkdown}
                onChange={(e) => setBodyMarkdown(e.target.value)}
                rows={18}
                className="min-h-72 font-mono text-sm"
                placeholder={`## Section title\n\nParagraph with a [link](/services).\n\n- First point\n- Second point\n\n1. Step one\n2. Step two\n\n> A short quote\n> — Attribution\n\n![Alt text](https://example.com/image.jpg)\n\nhttps://www.youtube.com/watch?v=VIDEO_ID`}
              />
            </AdminField>
            <div className="space-y-3 border border-ink/10 bg-white/70 px-4 py-3 text-xs leading-relaxed text-muted">
              <p className="font-medium uppercase tracking-[0.14em] text-ink/70">
                How to write
              </p>
              <ul className="space-y-2">
                <li>
                  <span className="text-ink">Headings:</span> start a line with{" "}
                  <code className="text-ink">## Title</code> or{" "}
                  <code className="text-ink">### Smaller title</code>
                </li>
                <li>
                  <span className="text-ink">Paragraphs:</span> write normally;
                  leave a blank line between them
                </li>
                <li>
                  <span className="text-ink">Quotes:</span>{" "}
                  <code className="text-ink">&gt; Quote text</code> (optional
                  second line{" "}
                  <code className="text-ink">&gt; — Name</code>)
                </li>
                <li>
                  <span className="text-ink">Lists:</span>{" "}
                  <code className="text-ink">- Bullet item</code> or{" "}
                  <code className="text-ink">1. Numbered item</code> (one item
                  per line; blank line ends the list)
                </li>
                <li>
                  <span className="text-ink">Link / YouTube / Image:</span> use
                  the toolbar buttons above — they insert the correct format
                  for you
                </li>
                <li>
                  <span className="text-ink">Side-by-side image + text:</span>
                  <pre className="mt-1 overflow-x-auto bg-stone/40 px-3 py-2 font-mono text-[11px] leading-snug text-ink">
{`:::imageText{side=left image="https://…/photo.jpg"}
Optional heading
Body paragraph here.
:::`}
                  </pre>
                  Use <code className="text-ink">side=right</code> to flip the
                  layout. Close with a line that is only{" "}
                  <code className="text-ink">:::</code>
                </li>
              </ul>
            </div>
            {!parseResult.ok ? (
              <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Markdown error: {parseResult.error}
              </p>
            ) : null}
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
              {canSave
                ? "Changes apply after you save."
                : "Fix Markdown errors before saving."}
            </p>
            <Button type="submit" disabled={pending || !canSave}>
              {pending
                ? "Saving…"
                : article
                  ? "Update article"
                  : "Create article"}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <ArticleHomePreview
          title={title}
          excerpt={excerpt}
          category={category}
          coverImageUrl={coverImageUrl}
        />
        <ArticleDetailPreview
          title={title}
          excerpt={excerpt}
          category={category}
          coverImageUrl={coverImageUrl}
          blocks={previewBlocks}
        />
      </div>
    </div>
  );
}
