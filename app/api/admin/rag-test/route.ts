import { streamText } from "ai";
import { z } from "zod";

import { getLiveClinicCatalog } from "@/lib/ai/catalog";
import {
  RAG_KNOWLEDGE_SOFT_CAP,
  softCapText,
} from "@/lib/ai/rag/constants";
import {
  buildChatSystemPrompt,
  formatRetrievedContext,
} from "@/lib/ai/rag/format";
import { retrieveRagContext } from "@/lib/ai/rag/retrieve";
import { getOpenAI } from "@/lib/ai/openai";
import { getAiSettings } from "@/lib/ai/settings";
import { requireUserManager } from "@/lib/auth/session";

export const maxDuration = 60;

const bodySchema = z.object({
  question: z.string().trim().min(1).max(2000),
});

export async function POST(request: Request) {
  try {
    await requireUserManager();
  } catch {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const configured = await getOpenAI("chat");
  if (!configured) {
    return Response.json(
      { error: "Configure an OpenAI API key first." },
      { status: 503 },
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
    return Response.json({ error: "Enter a question to test." }, { status: 400 });
  }

  const settings = await getAiSettings();
  const retrieved = await retrieveRagContext(parsed.data.question, {
    enabledOnly: false,
  });
  const catalog = await getLiveClinicCatalog();
  const system = buildChatSystemPrompt({
    systemPrompt: settings.systemPrompt,
    knowledgeBase: softCapText(settings.knowledgeBase, RAG_KNOWLEDGE_SOFT_CAP),
    retrieved: formatRetrievedContext(retrieved),
    catalog,
  });

  const sources = retrieved.map((chunk) => ({
    title: chunk.documentTitle,
    description: chunk.documentDescription,
    excerpt:
      chunk.content.length > 280
        ? `${chunk.content.slice(0, 277).trimEnd()}…`
        : chunk.content,
  }));

  const result = streamText({
    model: configured.model,
    system,
    messages: [{ role: "user", content: parsed.data.question }],
  });

  const response = result.toTextStreamResponse();
  response.headers.set(
    "x-rag-sources",
    Buffer.from(JSON.stringify(sources), "utf8").toString("base64"),
  );
  // Expose custom header to the browser fetch client.
  response.headers.set("Access-Control-Expose-Headers", "x-rag-sources");
  return response;
}
