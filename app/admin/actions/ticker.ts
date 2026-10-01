"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_CONTENT_MODEL,
  DEFAULT_KNOWLEDGE_BASE,
  DEFAULT_PRODUCT_MODEL,
  DEFAULT_SYSTEM_PROMPT,
} from "@/lib/ai/defaults";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { SITE_SETTINGS_ID, siteSettings } from "@/lib/db/schema";

const tickerSchema = z.object({
  tickerText: z.string().trim().min(1, "Ticker text is required."),
});

async function getOrCreateSettingsRow() {
  const existing = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);
  if (existing[0]) return existing[0];

  await db.insert(siteSettings).values({
    id: SITE_SETTINGS_ID,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    knowledgeBase: DEFAULT_KNOWLEDGE_BASE,
    chatModel: DEFAULT_CHAT_MODEL,
    contentModel: DEFAULT_CONTENT_MODEL,
    productModel: DEFAULT_PRODUCT_MODEL,
    enabled: true,
  });

  const created = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);
  return created[0]!;
}

export async function saveTickerTextAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = tickerSchema.safeParse({
    tickerText: formData.get("tickerText"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the ticker text." };
  }

  await getOrCreateSettingsRow();
  await db
    .update(siteSettings)
    .set({
      tickerText: parsed.data.tickerText,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, SITE_SETTINGS_ID));

  updateTag("ticker");
  revalidatePath("/admin/ticker");
  revalidatePath("/");
  return { success: "Ticker updated." };
}
