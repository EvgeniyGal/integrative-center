"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { safeParseMarkdown } from "@/lib/content/markdown";

const serviceDraftSchema = z.object({
  title: z.string(),
  slug: z.string(),
  eyebrow: z.string(),
  summary: z.string(),
  body: z.array(z.string()),
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

const system = `You help draft marketing copy for Health & Beauty Integrative Center, a clinical integrative practice in Sarasota, Florida.
Only expand on the notes the admin provides. Do not invent clinical claims, statistics, guarantees, or patient outcomes.
If something is unknown, use a short placeholder in brackets like [add detail].
Keep tone calm, clinical, and clear. Prefer short paragraphs.`;

export async function generateServiceDraftAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { draft?: z.infer<typeof serviceDraftSchema> }> {
  await requireAdmin();
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OPENAI_API_KEY is not configured." };
  }

  const title = String(formData.get("title") ?? "");
  const notes = String(formData.get("notes") ?? "");
  if (!title && !notes) {
    return { error: "Provide a title or notes for the draft." };
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: serviceDraftSchema,
      system,
      prompt: `Draft a service entry.
Title seed: ${title || "(none)"}
Admin notes:
${notes || "(none)"}
Return slug in kebab-case, a short eyebrow label, a 1-2 sentence summary, and 2-4 body paragraphs.`,
    });
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
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OPENAI_API_KEY is not configured." };
  }

  const title = String(formData.get("title") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const imageUrls = String(formData.get("imageUrls") ?? "");
  if (!title && !notes) {
    return { error: "Provide a title or notes for the draft." };
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: articleDraftSchema,
      system,
      prompt: `Draft a news/article entry. Return metadata fields plus bodyMarkdown (NOT JSON blocks).

Markdown dialect for bodyMarkdown:
- ## / ### for headings
- Blank-line-separated paragraphs (inline [label](url), **bold**, *italic* allowed)
- > quote lines; optional final "> — Attribution"
- ![alt](url) for images; consecutive image lines become a gallery
- A bare YouTube / youtu.be / shorts URL on its own line for video
- Optional :::imageText{side=left image="url"} ... :::
- Do not invent image URLs; only use: ${imageUrls || "(none)"}
- Do not invent YouTube links unless the admin notes include one
- Keep body focused and factual; no fake testimonials
- No JSON block arrays in the response

Title seed: ${title || "(none)"}
Admin notes:
${notes || "(none)"}`,
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
