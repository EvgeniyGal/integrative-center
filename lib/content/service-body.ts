import type { ArticleBlock } from "@/lib/content/blocks";
import { blocksToMarkdown } from "@/lib/content/markdown";

/** Convert legacy string[] paragraphs or ArticleBlock[] into blocks. */
export function normalizeServiceBody(body: unknown): ArticleBlock[] {
  if (!Array.isArray(body) || body.length === 0) return [];

  if (typeof body[0] === "string") {
    return (body as string[])
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({ type: "paragraph" as const, text }));
  }

  return body as ArticleBlock[];
}

export function serviceBodyToMarkdown(body: unknown): string {
  return blocksToMarkdown(normalizeServiceBody(body));
}

/** Plain text for card excerpts / search. */
export function serviceBodyPlainText(body: unknown): string {
  return normalizeServiceBody(body)
    .flatMap((block) => {
      if (block.type === "paragraph" || block.type === "heading") {
        return [block.text];
      }
      if (block.type === "quote") {
        return [block.text, block.attribution ?? ""].filter(Boolean);
      }
      if (block.type === "list") {
        return block.items;
      }
      if (block.type === "imageText") {
        return [block.text];
      }
      return [];
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
