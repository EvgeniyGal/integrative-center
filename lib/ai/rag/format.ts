import { softCapText, RAG_RETRIEVE_MAX_CHARS } from "@/lib/ai/rag/constants";

export type RetrievedChunk = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  documentDescription: string | null;
  content: string;
  score: number;
};

export function formatRetrievedContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";

  let used = 0;
  const parts: string[] = [];

  for (const [index, chunk] of chunks.entries()) {
    const header = chunk.documentDescription
      ? `### Source ${index + 1}: ${chunk.documentTitle}\nContext: ${chunk.documentDescription}`
      : `### Source ${index + 1}: ${chunk.documentTitle}`;
    const body = chunk.content.trim();
    const block = `${header}\n${body}`;
    if (used + block.length > RAG_RETRIEVE_MAX_CHARS && parts.length > 0) {
      break;
    }
    const remaining = RAG_RETRIEVE_MAX_CHARS - used;
    parts.push(softCapText(block, remaining));
    used += parts[parts.length - 1]!.length + 2;
  }

  return `Retrieved document excerpts:\n${parts.join("\n\n")}`;
}

export function buildChatSystemPrompt(parts: {
  systemPrompt: string;
  knowledgeBase: string;
  retrieved: string;
  catalog: string;
}): string {
  const sections = [
    parts.systemPrompt.trim(),
    "Response format: answer in clear Markdown (headings, lists, bold) when helpful. Cite document titles when you use retrieved excerpts.",
    `Knowledge base:\n${parts.knowledgeBase.trim()}`,
  ];

  if (parts.retrieved.trim()) {
    sections.push(parts.retrieved.trim());
  }

  sections.push(parts.catalog.trim());
  return sections.filter(Boolean).join("\n\n");
}
