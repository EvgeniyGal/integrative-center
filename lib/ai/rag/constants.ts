export const RAG_EMBEDDING_MODEL = "text-embedding-3-small";
export const RAG_MAX_FILE_BYTES = 10 * 1024 * 1024;
export const RAG_MAX_CHUNKS_PER_DOC = 200;
export const RAG_CHUNK_TARGET_TOKENS = 500;
export const RAG_CHUNK_OVERLAP_TOKENS = 80;
export const RAG_EMBED_BATCH_SIZE = 64;
export const RAG_MAX_EMBED_TOKENS = 8000;
export const RAG_RETRIEVE_VECTOR_LIMIT = 12;
export const RAG_RETRIEVE_KEYWORD_LIMIT = 12;
export const RAG_RETRIEVE_TOP_K = 6;
export const RAG_RETRIEVE_MAX_CHARS = 8000;
export const RAG_KNOWLEDGE_SOFT_CAP = 12_000;
export const RAG_BLOB_FOLDER = "rag-documents";

export const RAG_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export function estimateTokens(text: string): number {
  // Rough heuristic: ~4 characters per token for English-ish clinic docs.
  return Math.max(1, Math.ceil(text.length / 4));
}

export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
}

export function softCapText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1).trimEnd()}…`;
}

export function resolveRagMimeType(file: File): string | null {
  const name = file.name.toLowerCase();
  if (
    file.type === "application/pdf" ||
    (file.type === "" && name.endsWith(".pdf"))
  ) {
    return "application/pdf";
  }
  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    (file.type === "" && name.endsWith(".docx"))
  ) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (file.type === "text/plain" || (file.type === "" && name.endsWith(".txt"))) {
    return "text/plain";
  }
  return null;
}
