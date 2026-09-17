import { AiSettingsForm } from "@/components/admin/AiSettingsForm";
import { listOpenAIModels } from "@/lib/ai/openai";
import { getAiSettings } from "@/lib/ai/settings";
import { requireUserManager } from "@/lib/auth/session";

export const instant = false;

export default async function AdminSettingsPage() {
  await requireUserManager();
  const settings = await getAiSettings();
  const models = settings.apiKey
    ? await listOpenAIModels(settings.apiKey)
    : [];

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted">
        Configure the public chat widget and the models used for AI drafts.
        The OpenAI API key is stored encrypted and is never exposed to
        visitors.
      </p>
      <AiSettingsForm
        enabled={settings.enabled}
        hasStoredKey={settings.hasStoredKey}
        envKeyFallback={!settings.hasStoredKey && Boolean(settings.apiKey)}
        systemPrompt={settings.systemPrompt}
        knowledgeBase={settings.knowledgeBase}
        chatModel={settings.chatModel}
        contentModel={settings.contentModel}
        productModel={settings.productModel}
        models={models}
      />
    </div>
  );
}
