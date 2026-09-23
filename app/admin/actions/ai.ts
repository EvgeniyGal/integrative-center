"use server";

import { generateObject } from "ai";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { getOpenAI } from "@/lib/ai/openai";
import { requireAdmin } from "@/lib/auth/session";
import { safeParseMarkdown } from "@/lib/content/markdown";

const serviceDraftSchema = z.object({
  title: z.string(),
  slug: z.string(),
  eyebrow: z.string(),
  summary: z.string(),
  bodyMarkdown: z.string(),
});

const articleDraftSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),
  bodyMarkdown: z.string(),
});

const productDraftSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const formatSystem = `You format content for Health & Beauty Integrative Center, a clinical integrative practice in Sarasota, Florida.

CRITICAL — preserve wording:
- Do NOT paraphrase, rewrite, expand, shorten, or "improve" the admin's sentences.
- Do NOT invent clinical claims, statistics, guarantees, outcomes, testimonials, or details that are not in the notes.
- Keep every meaningful word from the notes in bodyMarkdown. You may only add Markdown structure (headings, lists, quotes, blank lines, light emphasis) around that wording.
- If notes are already Markdown, normalize structure lightly without changing the prose.

Metadata (title, slug, eyebrow/summary/excerpt, etc.) may be derived briefly from the notes when helpful. bodyMarkdown must stay faithful to the notes.

Tone of any new metadata: calm, clinical, clear.`;

const markdownDialect = `Markdown dialect for bodyMarkdown (NOT JSON blocks):
- ## / ### for headings (only when the notes already suggest sections)
- Blank-line-separated paragraphs (inline [label](url), **bold**, *italic* allowed — use sparingly and only on existing words)
- Unordered lists with "- item"; ordered lists with "1. item" when the notes list items/steps
- > quote lines; optional final "> — Attribution" when the notes include a quote
- ![alt](url) for images; consecutive image lines become a gallery
- A bare YouTube / youtu.be / shorts URL on its own line for video
- Optional :::imageText{side=left image="url"} ... :::
- Do not invent image URLs; only use URLs the admin provided (notes or allowed list)
- Do not invent YouTube links unless the admin notes include one
- When the notes include image or YouTube URLs, place them as Markdown media lines in a natural spot
- No JSON block arrays in the response`;

const productSystem = `You help draft marketing copy for Health & Beauty Integrative Center, a clinical integrative practice in Sarasota, Florida.
Only expand on the notes the admin provides. Do not invent clinical claims, statistics, guarantees, or patient outcomes.
If something is unknown, use a short placeholder in brackets like [add detail].
Keep tone calm, clinical, and clear. Prefer short paragraphs.`;

async function requireConfiguredModel(useCase: "content" | "product") {
  const configured = await getOpenAI(useCase);
  if (!configured) {
    return {
      error: "OpenAI is not configured. Add a key in Admin → Settings.",
    } as const;
  }
  return configured;
}

export async function generateServiceDraftAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { draft?: z.infer<typeof serviceDraftSchema> }> {
  await requireAdmin();
  const configured = await requireConfiguredModel("content");
  if ("error" in configured) return configured;

  const title = String(formData.get("title") ?? "");
  const notes =
    String(formData.get("notes") ?? "").trim() ||
    String(formData.get("fallbackBody") ?? "").trim();
  const imageUrls = String(formData.get("imageUrls") ?? "");
  if (!title && !notes) {
    return { error: "Provide a title or notes for the draft." };
  }

  try {
    const { object } = await generateObject({
      model: configured.model,
      schema: serviceDraftSchema,
      system: formatSystem,
      prompt: `Format a service entry. Return metadata fields plus bodyMarkdown.

${markdownDialect}
- Allowed image URLs only: ${imageUrls || "(none)"}
- You may place provided image URLs or YouTube URLs from the notes into Markdown image/video lines; never invent media URLs

Title seed: ${title || "(none)"}
Admin notes (preserve this wording in bodyMarkdown):
${notes || "(none)"}

Return slug in kebab-case, a short eyebrow label, a 1-2 sentence summary drawn from the notes (without inventing facts), and bodyMarkdown that structures the notes only.`,
    });

    const mdCheck = safeParseMarkdown(object.bodyMarkdown);
    if (!mdCheck.ok) {
      return {
        error: `AI returned invalid Markdown: ${mdCheck.error}`,
      };
    }

    return { success: "Draft generated. Review before saving.", draft: object };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "AI generation failed.",
    };
  }
}

export async function generateArticleDraftAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { draft?: z.infer<typeof articleDraftSchema> }> {
  await requireAdmin();
  const configured = await requireConfiguredModel("content");
  if ("error" in configured) return configured;

  const title = String(formData.get("title") ?? "");
  const notes =
    String(formData.get("notes") ?? "").trim() ||
    String(formData.get("fallbackBody") ?? "").trim();
  const imageUrls = String(formData.get("imageUrls") ?? "");
  if (!title && !notes) {
    return { error: "Provide a title or notes for the draft." };
  }

  try {
    const { object } = await generateObject({
      model: configured.model,
      schema: articleDraftSchema,
      system: formatSystem,
      prompt: `Format a news/article entry. Return metadata fields plus bodyMarkdown (NOT JSON blocks).

${markdownDialect}
- Allowed image URLs only: ${imageUrls || "(none)"}
- You may place provided image URLs or YouTube URLs from the notes into Markdown image/video lines; never invent media URLs

Title seed: ${title || "(none)"}
Admin notes (preserve this wording in bodyMarkdown):
${notes || "(none)"}

Return slug in kebab-case, excerpt/category/tags/SEO fields derived lightly from the notes, and bodyMarkdown that structures the notes only — do not rewrite the prose.`,
    });

    const mdCheck = safeParseMarkdown(object.bodyMarkdown);
    if (!mdCheck.ok) {
      return {
        error: `AI returned invalid Markdown: ${mdCheck.error}`,
      };
    }

    return { success: "Draft generated. Review before saving.", draft: object };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "AI generation failed.",
    };
  }
}

export async function generateProductDraftAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { draft?: z.infer<typeof productDraftSchema> }> {
  await requireAdmin();
  const configured = await requireConfiguredModel("product");
  if ("error" in configured) return configured;

  const title = String(formData.get("title") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const category = String(formData.get("category") ?? "");
  if (!title && !notes) {
    return { error: "Provide a title or notes for the draft." };
  }

  try {
    const { object } = await generateObject({
      model: configured.model,
      schema: productDraftSchema,
      system: productSystem,
      prompt: `Draft a recommended-product card for the clinic supplements page.
Category: ${category || "(none)"}
Title seed: ${title || "(none)"}
Admin notes:
${notes || "(none)"}
Return a concise retail title and a 1-3 sentence description. Do not invent prices, discount codes, or medical claims.`,
    });
    return { success: "Draft generated. Review before saving.", draft: object };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "AI generation failed.",
    };
  }
}
