import {
  KnowledgeSettingsForm,
  OpenAiSettingsForm,
} from "@/components/admin/AiSettingsForm";
import { NotificationRecipientsPanel } from "@/components/admin/NotificationRecipients";
import {
  SettingsTabs,
  parseSettingsTab,
} from "@/components/admin/SettingsTabs";
import { listOpenAIModels } from "@/lib/ai/openai";
import { getAiSettings } from "@/lib/ai/settings";
import { requireUserManager } from "@/lib/auth/session";
import { getNotificationRecipients } from "@/lib/notifications";

export const instant = false;

const INTRO: Record<string, string> = {
  openai:
    "Manage the OpenAI API key, chat widget, and the models used for the assistant and AI drafts.",
  knowledge:
    "The public chatbot answers from this prompt and knowledge base, plus live services, hours, and contact details.",
  emails:
    "Choose who receives consult requests from the contact form and newsletter signups from the site.",
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireUserManager();
  const { tab } = await searchParams;
  const current = parseSettingsTab(tab);

  const [settings, recipients] = await Promise.all([
    getAiSettings(),
    current === "emails" ? getNotificationRecipients() : Promise.resolve([]),
  ]);
  const models =
    current === "openai" && settings.apiKey
      ? await listOpenAIModels(settings.apiKey)
      : [];

  return (
    <div className="space-y-6">
      <SettingsTabs current={current} />
      <p className="max-w-2xl text-sm text-muted">{INTRO[current]}</p>
      {current === "openai" ? (
        <OpenAiSettingsForm
          enabled={settings.enabled}
          hasStoredKey={settings.hasStoredKey}
          chatModel={settings.chatModel}
          contentModel={settings.contentModel}
          productModel={settings.productModel}
          models={models}
        />
      ) : null}
      {current === "knowledge" ? (
        <KnowledgeSettingsForm
          systemPrompt={settings.systemPrompt}
          knowledgeBase={settings.knowledgeBase}
        />
      ) : null}
      {current === "emails" ? (
        <NotificationRecipientsPanel recipients={recipients} />
      ) : null}
    </div>
  );
}
