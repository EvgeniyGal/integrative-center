import { streamText } from "ai";
import { z } from "zod";

import { getLiveClinicCatalog } from "@/lib/ai/catalog";
import { getOpenAI } from "@/lib/ai/openai";
import {
  chatMessageSchema,
  getClientIp,
  takeChatRateLimit,
  trimChatHistory,
} from "@/lib/ai/rate-limit";

export const maxDuration = 60;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(chatMessageSchema.maxContent),
      }),
    )
    .min(1)
    .max(chatMessageSchema.maxHistory),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!takeChatRateLimit(ip)) {
    return Response.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  const configured = await getOpenAI("chat");
  if (!configured) {
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 503 },
    );
  }
  if (!configured.settings.enabled) {
    return Response.json(
      { error: "The assistant is currently unavailable." },
      { status: 403 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Check your message and try again." }, { status: 400 });
  }

  const messages = trimChatHistory(parsed.data.messages);
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") {
    return Response.json({ error: "Send a question to continue." }, { status: 400 });
  }

  const catalog = await getLiveClinicCatalog();
  const system = `${configured.settings.systemPrompt}

Knowledge base:
${configured.settings.knowledgeBase}

${catalog}`;

  const result = streamText({
    model: configured.model,
    system,
    messages,
  });

  return result.toTextStreamResponse();
}
