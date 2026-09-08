"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { articleBlockSchema } from "@/lib/content/blocks";

const serviceDraftSchema = z.object({
  title: z.string(),
  slug: z.string(),
  eyebrow: z.string(),
  summary: z.string(),
  body: z.array(z.string()),
  imageAlt: z.string().optional(),
});

const articleDraftSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),
  blocks: z.array(articleBlockSchema),
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
      prompt: `Draft a news/article entry as structured blocks.
Title seed: ${title || "(none)"}
Admin notes:
${notes || "(none)"}
Available image URLs (use only these if adding image blocks): ${imageUrls || "(none)"}
Use heading, paragraph, and optionally image/quote blocks. Do not invent image URLs.`,
    });
    return { success: "Draft generated. Review before saving.", draft: object };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "AI generation failed.",
    };
  }
}
