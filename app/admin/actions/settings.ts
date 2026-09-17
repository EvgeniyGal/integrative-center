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
import { encryptSecret } from "@/lib/ai/encrypt";
import { SITE_SETTINGS_ID, getAiSettings } from "@/lib/ai/settings";
import { requireUserManager } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

const schema = z.object({
  systemPrompt: z.string().min(1),
  knowledgeBase: z.string().min(1),
  chatModel: z.string().min(1),
  contentModel: z.string().min(1),
  productModel: z.string().min(1),
  enabled: z.boolean(),
  openaiApiKey: z.string(),
  clearApiKey: z.boolean(),
});

export async function saveAiSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();

  const parsed = schema.safeParse({
    systemPrompt: String(formData.get("systemPrompt") ?? "").trim() || DEFAULT_SYSTEM_PROMPT,
    knowledgeBase:
      String(formData.get("knowledgeBase") ?? "").trim() || DEFAULT_KNOWLEDGE_BASE,
    chatModel: String(formData.get("chatModel") ?? "").trim() || DEFAULT_CHAT_MODEL,
    contentModel:
      String(formData.get("contentModel") ?? "").trim() || DEFAULT_CONTENT_MODEL,
    productModel:
      String(formData.get("productModel") ?? "").trim() || DEFAULT_PRODUCT_MODEL,
    enabled: formData.get("enabled") === "on",
    openaiApiKey: String(formData.get("openaiApiKey") ?? "").trim(),
    clearApiKey: formData.get("clearApiKey") === "on",
  });

  if (!parsed.success) {
    return { error: "Check the AI settings fields." };
  }

  const existing = await db
    .select({
      id: siteSettings.id,
      openaiApiKeyEncrypted: siteSettings.openaiApiKeyEncrypted,
    })
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);

  let openaiApiKeyEncrypted = existing[0]?.openaiApiKeyEncrypted ?? null;
  if (parsed.data.clearApiKey) {
    openaiApiKeyEncrypted = null;
  } else if (parsed.data.openaiApiKey) {
    try {
      openaiApiKeyEncrypted = encryptSecret(parsed.data.openaiApiKey);
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Could not encrypt the API key.",
      };
    }
  }

  const values = {
    id: SITE_SETTINGS_ID,
    openaiApiKeyEncrypted,
    systemPrompt: parsed.data.systemPrompt,
    knowledgeBase: parsed.data.knowledgeBase,
    chatModel: parsed.data.chatModel,
    contentModel: parsed.data.contentModel,
    productModel: parsed.data.productModel,
    enabled: parsed.data.enabled,
    updatedAt: new Date(),
  };

  if (existing[0]) {
    await db
      .update(siteSettings)
      .set(values)
      .where(eq(siteSettings.id, SITE_SETTINGS_ID));
  } else {
    await db.insert(siteSettings).values(values);
  }

  updateTag("ai-settings");
  revalidatePath("/admin/settings");
  revalidatePath("/");

  return { success: "AI settings saved." };
}

export async function revealOpenAiApiKeyAction() {
  await requireUserManager();
  const settings = await getAiSettings();
  if (!settings.apiKey) {
    return { error: "No API key is saved." as const };
  }
  return { key: settings.apiKey };
}
