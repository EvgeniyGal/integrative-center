import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_CONTENT_MODEL,
  DEFAULT_KNOWLEDGE_BASE,
  DEFAULT_PRODUCT_MODEL,
  DEFAULT_SYSTEM_PROMPT,
} from "@/lib/ai/defaults";
import { decryptSecret } from "@/lib/ai/encrypt";
import { db } from "@/lib/db";
import { SITE_SETTINGS_ID, siteSettings } from "@/lib/db/schema";

export type AiSettings = {
  enabled: boolean;
  systemPrompt: string;
  knowledgeBase: string;
  chatModel: string;
  contentModel: string;
  productModel: string;
  hasStoredKey: boolean;
  apiKey: string | null;
};

type SettingsRow = typeof siteSettings.$inferSelect;

async function getSettingsRow() {
  "use cache";
  cacheTag("ai-settings");
  cacheLife("hours");

  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);
  return rows[0] ?? null;
}

function storedApiKey(row: SettingsRow | null) {
  if (!row?.openaiApiKeyEncrypted) return null;
  try {
    const decrypted = decryptSecret(row.openaiApiKeyEncrypted).trim();
    return decrypted || null;
  } catch {
    return null;
  }
}

export async function getAiSettings(): Promise<AiSettings> {
  const row = await getSettingsRow();
  const stored = storedApiKey(row);

  return {
    enabled: row?.enabled ?? true,
    systemPrompt: row?.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    knowledgeBase: row?.knowledgeBase || DEFAULT_KNOWLEDGE_BASE,
    chatModel: row?.chatModel || DEFAULT_CHAT_MODEL,
    contentModel: row?.contentModel || DEFAULT_CONTENT_MODEL,
    productModel: row?.productModel || DEFAULT_PRODUCT_MODEL,
    hasStoredKey: Boolean(stored),
    apiKey: stored,
  };
}

export async function isChatWidgetEnabled() {
  const settings = await getAiSettings();
  return settings.enabled && Boolean(settings.apiKey);
}

export { SITE_SETTINGS_ID };
