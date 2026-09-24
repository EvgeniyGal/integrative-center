import type { ArticleBlock } from "@/lib/content/blocks";
import { blocksToMarkdown } from "@/lib/content/markdown";

export function policyBodyToMarkdown(body: unknown): string {
  if (!Array.isArray(body)) return "";
  return blocksToMarkdown(body as ArticleBlock[]);
}

/** Plain text for About-card excerpts. */
export function policyBodyPlainText(body: unknown): string {
  if (!Array.isArray(body)) return "";
  return (body as ArticleBlock[])
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

/** First 2–3 sentences, ending with … */
export function policyCardExcerpt(body: unknown, fallback = ""): string {
  const text = (policyBodyPlainText(body) || fallback).trim();
  if (!text) return "";

  const sentences =
    text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)?.map((s) => s.trim()) ?? [
      text,
    ];

  let count = Math.min(2, sentences.length);
  if (sentences.length >= 3 && sentences.slice(0, 2).join(" ").length < 180) {
    count = 3;
  }

  const excerpt = sentences.slice(0, count).join(" ").trim();
  return `${excerpt.replace(/[.…]+$/, "")}…`;
}
