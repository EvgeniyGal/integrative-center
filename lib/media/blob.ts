import { del } from "@vercel/blob";

import type { ArticleBlock } from "@/lib/content/blocks";
import { db } from "@/lib/db";
import { articles, services } from "@/lib/db/schema";

/** Only delete blobs we uploaded for content (not shared library assets). */
export function isManagedBlobUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    if (
      !parsed.hostname.endsWith(".blob.vercel-storage.com") &&
      !parsed.hostname.endsWith(".public.blob.vercel-storage.com")
    ) {
      return false;
    }
    const path = parsed.pathname;
    if (path.includes("/library/")) return false;
    return /\/(articles|services)(\/|$)/.test(path);
  } catch {
    return false;
  }
}

export function collectBlockImageUrls(
  blocks: ArticleBlock[] | null | undefined,
): string[] {
  if (!Array.isArray(blocks)) return [];
  const urls: string[] = [];
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    if (block.type === "image" && block.url) urls.push(block.url);
    if (block.type === "gallery" && Array.isArray(block.images)) {
      for (const image of block.images) {
        if (image?.url) urls.push(image.url);
      }
    }
    if (block.type === "imageText" && block.image) urls.push(block.image);
  }
  return urls;
}

export function collectArticleImageUrls(article: {
  coverImageUrl?: string | null;
  blocks?: ArticleBlock[] | null;
}): string[] {
  const urls = [
    article.coverImageUrl ?? "",
    ...collectBlockImageUrls(article.blocks),
  ];
  return [...new Set(urls.filter(Boolean))];
}

export function collectServiceImageUrls(service: {
  imageUrl?: string | null;
}): string[] {
  return service.imageUrl ? [service.imageUrl] : [];
}

function uniqueManaged(urls: Iterable<string>) {
  return [
    ...new Set(
      [...urls].map((u) => u.trim()).filter((u) => isManagedBlobUrl(u)),
    ),
  ];
}

/** Best-effort Blob delete. Never throws into callers. */
export async function deleteBlobUrls(urls: Iterable<string>): Promise<void> {
  const managed = uniqueManaged(urls);
  if (managed.length === 0) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  try {
    await del(managed);
  } catch (error) {
    console.error("Failed to delete blob URL(s)", managed, error);
  }
}

/**
 * Collect every image URL currently stored on articles/services,
 * optionally excluding one record (the one being updated/deleted).
 */
export async function getReferencedBlobUrls(except?: {
  articleId?: string;
  serviceId?: string;
}): Promise<Set<string>> {
  const [allArticles, allServices] = await Promise.all([
    db.query.articles.findMany({
      columns: { id: true, coverImageUrl: true, blocks: true },
    }),
    db.query.services.findMany({
      columns: { id: true, imageUrl: true },
    }),
  ]);

  const referenced = new Set<string>();

  for (const article of allArticles) {
    if (except?.articleId && article.id === except.articleId) continue;
    for (const url of collectArticleImageUrls({
      coverImageUrl: article.coverImageUrl,
      blocks: article.blocks as ArticleBlock[],
    })) {
      if (isManagedBlobUrl(url)) referenced.add(url);
    }
  }

  for (const service of allServices) {
    if (except?.serviceId && service.id === except.serviceId) continue;
    for (const url of collectServiceImageUrls(service)) {
      if (isManagedBlobUrl(url)) referenced.add(url);
    }
  }

  return referenced;
}

/** Delete managed blob URLs that are no longer referenced by other content. */
export async function deleteOrphanBlobUrls(
  candidates: Iterable<string>,
  except?: { articleId?: string; serviceId?: string },
): Promise<void> {
  const managed = uniqueManaged(candidates);
  if (managed.length === 0) return;

  const referenced = await getReferencedBlobUrls(except);
  const orphans = managed.filter((url) => !referenced.has(url));
  await deleteBlobUrls(orphans);
}
