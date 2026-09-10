"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import {
  articleBlocksSchema,
  type ArticleBlock,
} from "@/lib/content/blocks";
import { safeParseMarkdown } from "@/lib/content/markdown";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import {
  collectArticleImageUrls,
  deleteOrphanBlobUrls,
} from "@/lib/media/blob";
import { uploadImageAsWebp } from "@/lib/media/upload";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function isArticleSlugTaken(slug: string, exceptId?: string) {
  const existing = await db.query.articles.findFirst({
    where: exceptId
      ? and(eq(articles.slug, slug), ne(articles.id, exceptId))
      : eq(articles.slug, slug),
    columns: { id: true },
  });
  return Boolean(existing);
}

function slugTakenMessage(slug: string) {
  return `Slug “${slug}” is already in use. Choose a different slug.`;
}

export type ArticleActionState = ActionState & {
  /** Persisted Blob URL returned after upload so retries keep the cover. */
  coverImageUrl?: string;
};

function readArticleSlug(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  return slugify(slugInput || title);
}

const articleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  coverImageUrl: z.string().min(1),
  category: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]),
  featuredOnHome: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()),
  blocks: articleBlocksSchema,
});

async function resolveCoverImage(
  file: File | null,
  formUrl: string,
  existingUrl: string,
) {
  if (file && file.size > 0) {
    return uploadImageAsWebp(file, "articles");
  }
  // Ignore ephemeral object URLs from the browser preview
  if (formUrl.startsWith("blob:")) {
    return existingUrl;
  }
  return formUrl || existingUrl;
}

function resolveBlocksFromForm(
  formData: FormData,
): { ok: true; blocks: ArticleBlock[] } | { ok: false; error: string } {
  const bodyMarkdown = String(formData.get("bodyMarkdown") ?? "");
  if (bodyMarkdown.trim()) {
    const parsed = safeParseMarkdown(bodyMarkdown);
    if (!parsed.ok) {
      return { ok: false, error: `Invalid Markdown: ${parsed.error}` };
    }
    return { ok: true, blocks: parsed.blocks };
  }

  const raw = String(formData.get("blocks") ?? "[]");
  if (!raw.trim()) return { ok: true, blocks: [] };
  try {
    const json = JSON.parse(raw) as unknown;
    return { ok: true, blocks: articleBlocksSchema.parse(json) };
  } catch {
    return { ok: false, error: "Invalid article blocks." };
  }
}

function parseArticleForm(formData: FormData, blocks: ArticleBlock[]) {
  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");
  return articleSchema.safeParse({
    slug: slugify(slugInput || title),
    title,
    excerpt: String(formData.get("excerpt") ?? ""),
    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
    category: String(formData.get("category") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    featuredOnHome: formData.get("featuredOnHome") === "on",
    seoTitle: String(formData.get("seoTitle") ?? "") || undefined,
    seoDescription: String(formData.get("seoDescription") ?? "") || undefined,
    tags: tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    blocks,
  });
}

export async function createArticleAction(
  _prev: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  await requireAdmin();
  let coverImageUrl = "";
  try {
    const slug = readArticleSlug(formData);
    if (!slug) {
      return { error: "Add a title or slug before saving." };
    }

    if (await isArticleSlugTaken(slug)) {
      const existingUrl = String(formData.get("coverImageUrl") ?? "");
      return {
        error: slugTakenMessage(slug),
        ...(existingUrl && !existingUrl.startsWith("blob:")
          ? { coverImageUrl: existingUrl }
          : {}),
      };
    }

    const file = formData.get("coverImage") as File | null;
    coverImageUrl = await resolveCoverImage(
      file,
      String(formData.get("coverImageUrl") ?? ""),
      "",
    );
    formData.set("coverImageUrl", coverImageUrl);
    const persistCover = coverImageUrl ? { coverImageUrl } : {};

    const blocksResult = resolveBlocksFromForm(formData);
    if (!blocksResult.ok) {
      return { error: blocksResult.error, ...persistCover };
    }
    const parsed = parseArticleForm(formData, blocksResult.blocks);
    if (!parsed.success) {
      return {
        error: "Check article fields and Markdown body.",
        ...persistCover,
      };
    }

    await db.insert(articles).values({
      ...parsed.data,
      publishedAt:
        parsed.data.status === "published" ? new Date() : null,
    });
    updateTag("articles");
    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath("/");
    return { success: "Article created." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create article.";
    if (/unique|duplicate/i.test(message)) {
      return {
        error: "That slug is already in use. Choose a different slug.",
        ...(coverImageUrl ? { coverImageUrl } : {}),
      };
    }
    return {
      error: message,
      ...(coverImageUrl ? { coverImageUrl } : {}),
    };
  }
}

export async function updateArticleAction(
  _prev: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing article id." };

  let coverImageUrl = "";
  try {
    const existing = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    });
    if (!existing) return { error: "Article not found." };

    const slug = readArticleSlug(formData);
    if (!slug) {
      return { error: "Add a title or slug before saving." };
    }
    if (await isArticleSlugTaken(slug, id)) {
      const existingUrl = String(formData.get("coverImageUrl") ?? "");
      return {
        error: slugTakenMessage(slug),
        ...(existingUrl && !existingUrl.startsWith("blob:")
          ? { coverImageUrl: existingUrl }
          : existing.coverImageUrl
            ? { coverImageUrl: existing.coverImageUrl }
            : {}),
      };
    }

    const previousUrls = collectArticleImageUrls({
      coverImageUrl: existing.coverImageUrl,
      blocks: existing.blocks as ArticleBlock[],
    });

    const file = formData.get("coverImage") as File | null;
    coverImageUrl = await resolveCoverImage(
      file,
      String(formData.get("coverImageUrl") ?? ""),
      existing.coverImageUrl,
    );
    formData.set("coverImageUrl", coverImageUrl);
    const persistCover = coverImageUrl ? { coverImageUrl } : {};

    const blocksResult = resolveBlocksFromForm(formData);
    if (!blocksResult.ok) {
      return { error: blocksResult.error, ...persistCover };
    }
    const parsed = parseArticleForm(formData, blocksResult.blocks);
    if (!parsed.success) {
      return {
        error: "Check article fields and Markdown body.",
        ...persistCover,
      };
    }

    const becomingPublished =
      parsed.data.status === "published" && existing.status !== "published";

    await db
      .update(articles)
      .set({
        ...parsed.data,
        publishedAt: becomingPublished
          ? new Date()
          : parsed.data.status === "published"
            ? existing.publishedAt ?? new Date()
            : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id));

    const nextUrls = new Set(
      collectArticleImageUrls({
        coverImageUrl: parsed.data.coverImageUrl,
        blocks: parsed.data.blocks,
      }),
    );
    const removed = previousUrls.filter((url) => !nextUrls.has(url));
    await deleteOrphanBlobUrls(removed, { articleId: id });

    updateTag("articles");
    updateTag(`article:${parsed.data.slug}`);
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}`);
    revalidatePath("/news");
    revalidatePath(`/news/${parsed.data.slug}`);
    revalidatePath("/");
    return { success: "Article updated." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update article.";
    if (/unique|duplicate/i.test(message)) {
      return {
        error: "That slug is already in use. Choose a different slug.",
        ...(coverImageUrl ? { coverImageUrl } : {}),
      };
    }
    return {
      error: message,
      ...(coverImageUrl ? { coverImageUrl } : {}),
    };
  }
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing article id.");

  const existing = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });
  if (!existing) throw new Error("Article not found.");

  const urls = collectArticleImageUrls({
    coverImageUrl: existing.coverImageUrl,
    blocks: existing.blocks as ArticleBlock[],
  });

  await db.delete(articles).where(eq(articles.id, id));
  await deleteOrphanBlobUrls(urls, { articleId: id });

  updateTag("articles");
  updateTag(`article:${existing.slug}`);
  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath(`/news/${existing.slug}`);
  revalidatePath("/");
}

export async function setArticleFlagAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing article id.");
  if (field !== "featuredOnHome" && field !== "status") {
    throw new Error("Invalid article flag.");
  }

  const existing = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });
  if (!existing) throw new Error("Article not found.");

  if (field === "featuredOnHome") {
    await db
      .update(articles)
      .set({ featuredOnHome: value, updatedAt: new Date() })
      .where(eq(articles.id, id));
  } else {
    const status = value ? "published" : "draft";
    const becomingPublished =
      status === "published" && existing.status !== "published";
    await db
      .update(articles)
      .set({
        status,
        publishedAt: becomingPublished
          ? new Date()
          : status === "published"
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id));
  }

  updateTag("articles");
  updateTag(`article:${existing.slug}`);
  revalidatePath("/admin/news");
  revalidatePath(`/news/${existing.slug}`);
  revalidatePath("/news");
  revalidatePath("/");
}
