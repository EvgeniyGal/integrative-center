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
import { notificationRecipients, siteSettings } from "@/lib/db/schema";
import { sendTestStaffEmail } from "@/lib/email";
import { getRecipientEmails } from "@/lib/notifications";

const openAiSchema = z.object({
  chatModel: z.string().min(1),
  contentModel: z.string().min(1),
  productModel: z.string().min(1),
  openaiApiKey: z.string(),
});

const knowledgeSchema = z.object({
  systemPrompt: z.string().min(1),
  knowledgeBase: z.string().min(1),
  enabled: z.boolean(),
});

const recipientSchema = z.object({
  email: z.string().email(),
  label: z.string().max(80),
  receiveContact: z.boolean(),
  receiveNewsletter: z.boolean(),
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

function revalidateSettings() {
  updateTag("ai-settings");
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

function revalidateRecipients() {
  updateTag("notification-recipients");
  revalidatePath("/admin/settings");
}

export async function saveOpenAiSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();

  const parsed = openAiSchema.safeParse({
    chatModel: String(formData.get("chatModel") ?? "").trim() || DEFAULT_CHAT_MODEL,
    contentModel:
      String(formData.get("contentModel") ?? "").trim() || DEFAULT_CONTENT_MODEL,
    productModel:
      String(formData.get("productModel") ?? "").trim() || DEFAULT_PRODUCT_MODEL,
    openaiApiKey: String(formData.get("openaiApiKey") ?? "").trim(),
  });

  if (!parsed.success) {
    return { error: "Check the OpenAI settings fields." };
  }

  const existing = await getOrCreateSettingsRow();
  let openaiApiKeyEncrypted = existing.openaiApiKeyEncrypted ?? null;
  if (parsed.data.openaiApiKey) {
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

  await db
    .update(siteSettings)
    .set({
      openaiApiKeyEncrypted,
      chatModel: parsed.data.chatModel,
      contentModel: parsed.data.contentModel,
      productModel: parsed.data.productModel,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, SITE_SETTINGS_ID));

  revalidateSettings();
  return { success: "Credentials and models saved." };
}

export async function saveKnowledgeSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();

  const parsed = knowledgeSchema.safeParse({
    systemPrompt:
      String(formData.get("systemPrompt") ?? "").trim() || DEFAULT_SYSTEM_PROMPT,
    knowledgeBase:
      String(formData.get("knowledgeBase") ?? "").trim() || DEFAULT_KNOWLEDGE_BASE,
    enabled: formData.get("enabled") === "on",
  });

  if (!parsed.success) {
    return { error: "Check the knowledge fields." };
  }

  await getOrCreateSettingsRow();
  await db
    .update(siteSettings)
    .set({
      systemPrompt: parsed.data.systemPrompt,
      knowledgeBase: parsed.data.knowledgeBase,
      enabled: parsed.data.enabled,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, SITE_SETTINGS_ID));

  revalidateSettings();
  return { success: "Chat knowledge saved." };
}

export async function revealOpenAiApiKeyAction() {
  await requireUserManager();
  const settings = await getAiSettings();
  if (!settings.apiKey) {
    return { error: "No API key is saved." as const };
  }
  return { key: settings.apiKey };
}

export async function addNotificationRecipientAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();

  const parsed = recipientSchema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    label: String(formData.get("label") ?? "").trim(),
    receiveContact: formData.get("receiveContact") === "on",
    receiveNewsletter: formData.get("receiveNewsletter") === "on",
  });

  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }
  if (!parsed.data.receiveContact && !parsed.data.receiveNewsletter) {
    return { error: "Choose at least one type of message to receive." };
  }

  try {
    await db.insert(notificationRecipients).values({
      email: parsed.data.email,
      label: parsed.data.label || null,
      receiveContact: parsed.data.receiveContact,
      receiveNewsletter: parsed.data.receiveNewsletter,
    });
  } catch {
    return { error: "That email is already on the list." };
  }

  revalidateRecipients();
  return { success: "Recipient added." };
}

export async function updateNotificationRecipientAction(formData: FormData) {
  await requireUserManager();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing recipient id.");

  await db
    .update(notificationRecipients)
    .set({
      receiveContact: formData.get("receiveContact") === "on",
      receiveNewsletter: formData.get("receiveNewsletter") === "on",
      updatedAt: new Date(),
    })
    .where(eq(notificationRecipients.id, id));

  revalidateRecipients();
}

export async function deleteNotificationRecipientAction(formData: FormData) {
  await requireUserManager();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing recipient id.");
  await db.delete(notificationRecipients).where(eq(notificationRecipients.id, id));
  revalidateRecipients();
}

export async function sendTestNotificationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();
  const channel =
    formData.get("channel") === "newsletter" ? "newsletter" : "contact";
  const to = await getRecipientEmails(channel);
  if (to.length === 0) {
    return { error: "Add a recipient for this type of message first." };
  }

  try {
    const result = await sendTestStaffEmail({ to, channel });
    if (result.sent === 0) {
      return { error: result.error ?? "The test email could not be sent." };
    }
    if (result.error) {
      return {
        error: `Sent to some addresses, but not all. ${result.error}`,
      };
    }
    return { success: `Test email sent to ${to.join(", ")}.` };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "The test email could not be sent.",
    };
  }
}
