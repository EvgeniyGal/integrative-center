"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import {
  articleBlocksSchema,
  type ArticleBlock,
} from "@/lib/content/blocks";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

async function maybeUploadImage(file: File | null, fallback: string) {
  if (!file || file.size === 0) return fallback;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  const blob = await put(`articles/${Date.now()}-${file.name}`, file, {
    access: "public",
  });
  return blob.url;
}

function parseBlocks(raw: string): ArticleBlock[] {
  if (!raw.trim()) return [];
  const json = JSON.parse(raw) as unknown;
  return articleBlocksSchema.parse(json);
}

function parseArticleForm(formData: FormData) {
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
    blocks: parseBlocks(String(formData.get("blocks") ?? "[]")),
  });
}

export async function createArticleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  try {
    const file = formData.get("coverImage") as File | null;
    const coverImageUrl = await maybeUploadImage(
      file,
      String(formData.get("coverImageUrl") ?? ""),
    );
    formData.set("coverImageUrl", coverImageUrl);
    const parsed = parseArticleForm(formData);
    if (!parsed.success) {
      return { error: "Check article fields and blocks JSON." };
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
    return {
      error: error instanceof Error ? error.message : "Could not create article.",
    };
  }
}

export async function updateArticleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing article id." };

  try {
    const existing = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    });
    if (!existing) return { error: "Article not found." };

    const file = formData.get("coverImage") as File | null;
    const coverImageUrl = await maybeUploadImage(file, existing.coverImageUrl);
    formData.set("coverImageUrl", coverImageUrl);

    const parsed = parseArticleForm(formData);
    if (!parsed.success) {
      return { error: "Check article fields and blocks JSON." };
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

    updateTag("articles");
    updateTag(`article:${parsed.data.slug}`);
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}`);
    revalidatePath("/news");
    revalidatePath(`/news/${parsed.data.slug}`);
    revalidatePath("/");
    return { success: "Article updated." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not update article.",
    };
  }
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing article id.");
  await db.delete(articles).where(eq(articles.id, id));
  updateTag("articles");
  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
}
