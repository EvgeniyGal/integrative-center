import {
  estimateTokens,
  RAG_EMBED_BATCH_SIZE,
  RAG_EMBEDDING_MODEL,
  RAG_MAX_EMBED_TOKENS,
  truncateToTokens,
} from "@/lib/ai/rag/constants";
import { getAiSettings } from "@/lib/ai/settings";

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getOpenAIApiKeyForEmbeddings(): Promise<string | null> {
  const settings = await getAiSettings();
  return settings.apiKey;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const apiKey = await getOpenAIApiKeyForEmbeddings();
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }

  const prepared = texts.map((text) => {
    const truncated = truncateToTokens(text, RAG_MAX_EMBED_TOKENS);
    if (estimateTokens(truncated) > RAG_MAX_EMBED_TOKENS) {
      throw new Error("A text chunk exceeds the embedding token limit.");
    }
    return truncated;
  });

  const vectors: number[][] = [];

  for (let offset = 0; offset < prepared.length; offset += RAG_EMBED_BATCH_SIZE) {
    const batch = prepared.slice(offset, offset + RAG_EMBED_BATCH_SIZE);
    const batchVectors = await embedBatchWithRetry(apiKey, batch);
    vectors.push(...batchVectors);
  }

  return vectors;
}

export async function embedQuery(query: string): Promise<number[]> {
  const [vector] = await embedTexts([query]);
  if (!vector) throw new Error("Failed to embed query.");
  return vector;
}

async function embedBatchWithRetry(
  apiKey: string,
  inputs: string[],
  attempt = 0,
): Promise<number[][]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: RAG_EMBEDDING_MODEL,
      input: inputs,
    }),
  });

  if (response.status === 429 && attempt < 5) {
    const retryAfter = Number(response.headers.get("retry-after") ?? 0);
    const delay = retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt;
    await sleep(delay);
    return embedBatchWithRetry(apiKey, inputs, attempt + 1);
  }

  if (!response.ok) {
    let detail = "";
    try {
      const payload = (await response.json()) as {
        error?: { message?: string };
      };
      detail = payload.error?.message ?? "";
    } catch {
      // ignore
    }
    throw new Error(
      detail || `OpenAI embeddings failed (${response.status}).`,
    );
  }

  const payload = (await response.json()) as {
    data?: Array<{ embedding?: number[]; index?: number }>;
  };

  const rows = [...(payload.data ?? [])].sort(
    (a, b) => (a.index ?? 0) - (b.index ?? 0),
  );

  if (rows.length !== inputs.length) {
    throw new Error("Embedding response size did not match input batch.");
  }

  return rows.map((row) => {
    if (!row.embedding || row.embedding.length === 0) {
      throw new Error("Embedding response was empty.");
    }
    return row.embedding;
  });
}
