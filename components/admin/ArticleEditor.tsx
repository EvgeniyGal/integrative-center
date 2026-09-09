"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { generateArticleDraftAction } from "@/app/admin/actions/ai";
import {
  createArticleAction,
  updateArticleAction,
} from "@/app/admin/actions/articles";
import type { ActionState } from "@/app/admin/actions/auth";
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

export function ArticleEditor({ article }: { article?: Article }) {
  const id = article?.id ?? "new";
  const markdownRef = useRef<HTMLTextAreaElement>(null);

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

  const action = article ? updateArticleAction : createArticleAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);
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

  function insertLink() {
    const label = window.prompt("Link label", "Read more") ?? "";
    if (!label.trim()) return;
    const href =
      window.prompt("Link URL", "https://") ?? "";
    if (!href.trim()) return;
    applyInsertion(`[${label.trim()}](${href.trim()})`);
  }

  function insertYoutube() {
    const url =
      window.prompt(
        "YouTube URL",
        "https://www.youtube.com/watch?v=",
      ) ?? "";
    if (!url.trim()) return;
    applyInsertion(`\n\n${url.trim()}\n\n`);
  }

  function insertImage() {
    const url =
      window.prompt("Image URL", coverImageUrl || "https://") ?? "";
    if (!url.trim()) return;
    const alt = window.prompt("Alt text", "") ?? "";
    applyInsertion(`\n\n![${alt}](${url.trim()})\n\n`);
  }

  const canSave = parseResult.ok;
  const blocksForSave = parseResult.ok
    ? JSON.stringify(parseResult.blocks)
    : JSON.stringify(lastGoodBlocks);
  const previewBlocks = parseResult.ok ? parseResult.blocks : lastGoodBlocks;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)]">
      <div className="space-y-5">
        <form
          action={aiAction}
          className="space-y-4 border border-dashed border-brand/35 bg-brand-light/25 p-5"
        >
          <div className="space-y-1">
            <h3 className="font-display text-xl text-ink">AI draft assist</h3>
            <p className="text-sm text-muted">
              Provide notes. AI drafts the article fields and Markdown body —
              review before saving.
            </p>
          </div>
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="imageUrls" value={coverImageUrl} />
          <AdminField label="Notes" htmlFor={`notes-${id}`}>
            <Textarea
              id={`notes-${id}`}
              name="notes"
              variant="box"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Article outline, key points, what patients should know…"
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
                />
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
            description="Used on cards and article header."
          >
            <ImageField
              label="Cover image"
              fileName="coverImage"
              urlName="coverImageUrl"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              required={!article}
            />
          </AdminSection>

          <AdminSection
            title="Body"
            description="Write in Markdown. It is converted to structured blocks on save."
          >
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={insertLink}>
                Link
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={insertYoutube}
              >
                YouTube
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={insertImage}
              >
                Image
              </Button>
            </div>
            <AdminField label="Markdown" htmlFor={`markdown-${id}`}>
              <Textarea
                ref={markdownRef}
                id={`markdown-${id}`}
                variant="box"
                value={bodyMarkdown}
                onChange={(e) => setBodyMarkdown(e.target.value)}
                rows={18}
                className="min-h-72 font-mono text-sm"
                placeholder={`## Section title\n\nParagraph with a [link](/services).\n\n> A short quote\n> — Attribution\n\n![Alt text](https://example.com/image.jpg)\n\nhttps://www.youtube.com/watch?v=VIDEO_ID`}
              />
            </AdminField>
            <p className="text-xs leading-relaxed text-muted">
              Use <code className="text-ink">##</code> /{" "}
              <code className="text-ink">###</code> headings, blank lines between
              paragraphs, <code className="text-ink">&gt; quote</code>,{" "}
              <code className="text-ink">![alt](url)</code>,{" "}
              <code className="text-ink">[label](url)</code>, and paste a YouTube
              URL on its own line. Optional:{" "}
              <code className="text-ink">
                :::imageText{"{"}side=left image=&quot;url&quot;{"}"}
              </code>
            </p>
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
