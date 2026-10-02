import { estimateTokens, RAG_CHUNK_OVERLAP_TOKENS, RAG_CHUNK_TARGET_TOKENS, RAG_MAX_CHUNKS_PER_DOC, truncateToTokens, RAG_MAX_EMBED_TOKENS } from "@/lib/ai/rag/constants";

export type TextChunk = {
  content: string;
  tokenEstimate: number;
  chunkIndex: number;
};

/**
 * Split text into overlapping chunks sized for embedding limits.
 */
export function chunkText(raw: string): TextChunk[] {
  const normalized = raw
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalized) return [];

  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: TextChunk[] = [];
  let buffer = "";

  const flush = () => {
    const content = truncateToTokens(buffer.trim(), RAG_MAX_EMBED_TOKENS);
    if (!content) {
      buffer = "";
      return;
    }
    chunks.push({
      content,
      tokenEstimate: estimateTokens(content),
      chunkIndex: chunks.length,
    });
    buffer = "";
  };

  for (const paragraph of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (estimateTokens(candidate) <= RAG_CHUNK_TARGET_TOKENS) {
      buffer = candidate;
      continue;
    }

    if (buffer) flush();

    if (estimateTokens(paragraph) <= RAG_CHUNK_TARGET_TOKENS) {
      buffer = paragraph;
      continue;
    }

    // Oversized paragraph: split by sentences / hard length.
    const pieces = splitLongParagraph(paragraph);
    for (const piece of pieces) {
      const next = buffer ? `${buffer}\n\n${piece}` : piece;
      if (estimateTokens(next) <= RAG_CHUNK_TARGET_TOKENS) {
        buffer = next;
      } else {
        if (buffer) flush();
        buffer = piece;
      }
    }
  }

  if (buffer.trim()) flush();

  if (chunks.length === 0) return [];

  // Apply overlap by prepending a tail from the previous chunk.
  const withOverlap: TextChunk[] = chunks.map((chunk, index) => {
    if (index === 0) return chunk;
    const prev = chunks[index - 1]!;
    const overlap = takeTokenTail(prev.content, RAG_CHUNK_OVERLAP_TOKENS);
    if (!overlap) return chunk;
    const merged = truncateToTokens(`${overlap}\n\n${chunk.content}`, RAG_MAX_EMBED_TOKENS);
    return {
      ...chunk,
      content: merged,
      tokenEstimate: estimateTokens(merged),
    };
  });

  if (withOverlap.length > RAG_MAX_CHUNKS_PER_DOC) {
    throw new Error(
      `Document is too large after chunking (${withOverlap.length} chunks). Max is ${RAG_MAX_CHUNKS_PER_DOC}. Split the file or shorten it.`,
    );
  }

  return withOverlap;
}

function splitLongParagraph(paragraph: string): string[] {
  const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(Boolean);
  const pieces: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence;
    if (estimateTokens(next) <= RAG_CHUNK_TARGET_TOKENS) {
      current = next;
      continue;
    }
    if (current) pieces.push(current);
    if (estimateTokens(sentence) <= RAG_CHUNK_TARGET_TOKENS) {
      current = sentence;
    } else {
      // Hard split by characters if a single sentence is huge.
      const maxChars = RAG_CHUNK_TARGET_TOKENS * 4;
      for (let i = 0; i < sentence.length; i += maxChars) {
        pieces.push(sentence.slice(i, i + maxChars));
      }
      current = "";
    }
  }
  if (current) pieces.push(current);
  return pieces;
}

function takeTokenTail(text: string, tokens: number): string {
  const maxChars = tokens * 4;
  if (text.length <= maxChars) return text;
  const slice = text.slice(-maxChars);
  const boundary = slice.search(/\s/);
  return (boundary > 0 ? slice.slice(boundary) : slice).trim();
}
