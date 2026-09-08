"use client";

import { useActionState, useEffect, useState } from "react";

import { generateArticleDraftAction } from "@/app/admin/actions/ai";
import {
  createArticleAction,
  updateArticleAction,
} from "@/app/admin/actions/articles";
import type { ActionState } from "@/app/admin/actions/auth";
import {
  ArticleDetailPreview,
  ArticleHomePreview,
} from "@/components/admin/ContentPreviews";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleBlock } from "@/lib/content/blocks";
import type { Article } from "@/lib/db/schema";

const emptyBlocks: ArticleBlock[] = [
  { type: "paragraph", text: "" },
];

export function ArticleEditor({ article }: { article?: Article }) {
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
  const [blocksJson, setBlocksJson] = useState(
    JSON.stringify(article?.blocks?.length ? article.blocks : emptyBlocks, null, 2),
  );
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(article?.status ?? "draft");

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
        blocks: ArticleBlock[];
      };
    },
  );

  useEffect(() => {
    if (aiState.draft) {
      setTitle(aiState.draft.title);
      setSlug(aiState.draft.slug);
      setExcerpt(aiState.draft.excerpt);
      setCategory(aiState.draft.category);
      setTags(aiState.draft.tags.join(", "));
      setSeoTitle(aiState.draft.seoTitle);
      setSeoDescription(aiState.draft.seoDescription);
      setBlocksJson(JSON.stringify(aiState.draft.blocks, null, 2));
    }
  }, [aiState.draft]);

  function addBlock(type: ArticleBlock["type"]) {
    try {
      const blocks = JSON.parse(blocksJson) as ArticleBlock[];
      const next: ArticleBlock =
        type === "heading"
          ? { type: "heading", level: 2, text: "" }
          : type === "paragraph"
            ? { type: "paragraph", text: "" }
            : type === "image"
              ? { type: "image", url: coverImageUrl || "", alt: "", layout: "wide" }
              : type === "gallery"
                ? { type: "gallery", images: [{ url: coverImageUrl || "", alt: "" }] }
                : type === "imageText"
                  ? {
                      type: "imageText",
                      text: "",
                      image: coverImageUrl || "",
                      side: "left",
                    }
                  : { type: "quote", text: "" };
      setBlocksJson(JSON.stringify([...blocks, next], null, 2));
    } catch {
      setBlocksJson(JSON.stringify([emptyBlocks[0]], null, 2));
    }
  }

  function parsePreviewBlocks(): ArticleBlock[] {
    try {
      const parsed = JSON.parse(blocksJson) as ArticleBlock[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)]">
      <div className="space-y-6 border border-ink/10 bg-ivory p-6">
      <form action={aiAction} className="space-y-3 border-b border-ink/10 pb-6">
        <h3 className="font-display text-xl">AI draft assist</h3>
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="imageUrls" value={coverImageUrl} />
        <Textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Article outline, key points, what patients should know…"
        />
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

      <form action={formAction} className="space-y-4">
        {article ? <input type="hidden" name="id" value={article.id} /> : null}
        <input type="hidden" name="blocks" value={blocksJson} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Excerpt</Label>
          <Textarea name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={3} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Input name="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input name="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>SEO title</Label>
            <Input name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 w-full border-b border-stone-300 bg-transparent outline-none focus:border-brand"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>SEO description</Label>
          <Textarea
            name="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
          />
        </div>
        <ImageField
          label="Cover image"
          fileName="coverImage"
          urlName="coverImageUrl"
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          required={!article}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featuredOnHome"
            defaultChecked={article?.featuredOnHome ?? false}
          />
          Feature on home
        </label>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>Body blocks (JSON)</Label>
            <div className="flex flex-wrap gap-2">
              {(
                ["heading", "paragraph", "image", "gallery", "imageText", "quote"] as const
              ).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(type)}
                >
                  + {type}
                </Button>
              ))}
            </div>
          </div>
          <Textarea
            value={blocksJson}
            onChange={(e) => setBlocksJson(e.target.value)}
            rows={16}
            className="font-mono text-sm"
          />
        </div>

        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.success ? (
          <p className="text-sm text-brand-dark">{state.success}</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : article ? "Update article" : "Create article"}
        </Button>
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
          blocks={parsePreviewBlocks()}
        />
      </div>
    </div>
  );
}
