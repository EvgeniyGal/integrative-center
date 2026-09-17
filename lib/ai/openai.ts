import { createOpenAI } from "@ai-sdk/openai";

import { FALLBACK_OPENAI_MODELS } from "@/lib/ai/defaults";
import { getAiSettings } from "@/lib/ai/settings";

export type AiUseCase = "chat" | "content" | "product";

export async function listOpenAIModels(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return [...FALLBACK_OPENAI_MODELS];
    }
    const payload = (await response.json()) as {
      data?: Array<{ id?: string }>;
    };
    const ids = (payload.data ?? [])
      .map((item) => item.id ?? "")
      .filter(isChatModel);
    const unique = [...new Set(ids)].sort(compareModelIds);
    return unique.length > 0 ? unique : [...FALLBACK_OPENAI_MODELS];
  } catch {
    return [...FALLBACK_OPENAI_MODELS];
  }
}

function isChatModel(id: string) {
  const lower = id.toLowerCase();
  if (
    /instruct|audio|realtime|tts|whisper|transcribe|image|dall-e|search|embedding|moderation|preview-tts|computer-use/.test(
      lower,
    )
  ) {
    return false;
  }
  return /^(gpt-|o[1-9]|chatgpt-)/.test(lower);
}

function compareModelIds(a: string, b: string) {
  const dated = (id: string) => /\d{4}-\d{2}-\d{2}/.test(id);
  if (dated(a) !== dated(b)) return dated(a) ? 1 : -1;
  return a.localeCompare(b);
}

export async function getOpenAI(useCase: AiUseCase) {
  const settings = await getAiSettings();
  if (!settings.apiKey) return null;

  const modelId =
    useCase === "chat"
      ? settings.chatModel
      : useCase === "content"
        ? settings.contentModel
        : settings.productModel;

  const client = createOpenAI({ apiKey: settings.apiKey });
  return { model: client(modelId), settings };
}
