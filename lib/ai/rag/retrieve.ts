import { and, eq, sql } from "drizzle-orm";

import { embedQuery } from "@/lib/ai/rag/embed";
import type { RetrievedChunk } from "@/lib/ai/rag/format";
import {
  RAG_RETRIEVE_KEYWORD_LIMIT,
  RAG_RETRIEVE_TOP_K,
  RAG_RETRIEVE_VECTOR_LIMIT,
} from "@/lib/ai/rag/constants";
import { db } from "@/lib/db";
import { ragChunks, ragDocuments } from "@/lib/db/schema";

type RankedHit = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  documentDescription: string | null;
  content: string;
  rank: number;
};

function reciprocalRankFusion(
  lists: RankedHit[][],
  k = 60,
): RetrievedChunk[] {
  const scores = new Map<string, RetrievedChunk & { rrf: number }>();

  for (const list of lists) {
    for (const hit of list) {
      const existing = scores.get(hit.chunkId);
      const add = 1 / (k + hit.rank);
      if (existing) {
        existing.rrf += add;
        existing.score = existing.rrf;
      } else {
        scores.set(hit.chunkId, {
          chunkId: hit.chunkId,
          documentId: hit.documentId,
          documentTitle: hit.documentTitle,
          documentDescription: hit.documentDescription,
          content: hit.content,
          rrf: add,
          score: add,
        });
      }
    }
  }

  return [...scores.values()]
    .sort((a, b) => b.rrf - a.rrf)
    .slice(0, RAG_RETRIEVE_TOP_K)
    .map(({ rrf: _rrf, ...rest }) => rest);
}

function embeddingSql(embedding: number[]) {
  const literal = `[${embedding.map((n) => Number(n)).join(",")}]`;
  return sql.raw(`'${literal}'::vector`);
}

export async function retrieveRagContext(
  query: string,
  options?: { enabledOnly?: boolean },
): Promise<RetrievedChunk[]> {
  const q = query.trim();
  if (!q) return [];

  const enabledOnly = options?.enabledOnly ?? true;

  let queryEmbedding: number[];
  try {
    queryEmbedding = await embedQuery(q);
  } catch {
    queryEmbedding = [];
  }

  const vectorHits =
    queryEmbedding.length > 0
      ? await searchByVector(queryEmbedding, enabledOnly)
      : [];
  const keywordHits = await searchByKeyword(q, enabledOnly);

  if (vectorHits.length === 0 && keywordHits.length === 0) return [];
  if (vectorHits.length === 0) {
    return keywordHits.slice(0, RAG_RETRIEVE_TOP_K).map((hit) => ({
      chunkId: hit.chunkId,
      documentId: hit.documentId,
      documentTitle: hit.documentTitle,
      documentDescription: hit.documentDescription,
      content: hit.content,
      score: 1 / hit.rank,
    }));
  }
  if (keywordHits.length === 0) {
    return vectorHits.slice(0, RAG_RETRIEVE_TOP_K).map((hit) => ({
      chunkId: hit.chunkId,
      documentId: hit.documentId,
      documentTitle: hit.documentTitle,
      documentDescription: hit.documentDescription,
      content: hit.content,
      score: 1 / hit.rank,
    }));
  }

  return reciprocalRankFusion([vectorHits, keywordHits]);
}

async function searchByVector(
  embedding: number[],
  enabledOnly: boolean,
): Promise<RankedHit[]> {
  const vectorExpr = embeddingSql(embedding);
  const statusReady = eq(ragDocuments.status, "ready");
  const enabledFilter = enabledOnly
    ? and(statusReady, eq(ragDocuments.enabled, true))
    : statusReady;

  const rows = await db
    .select({
      chunkId: ragChunks.id,
      documentId: ragChunks.documentId,
      documentTitle: ragDocuments.title,
      documentDescription: ragDocuments.description,
      content: ragChunks.content,
      distance: sql<number>`${ragChunks.embedding} <=> ${vectorExpr}`,
    })
    .from(ragChunks)
    .innerJoin(ragDocuments, eq(ragChunks.documentId, ragDocuments.id))
    .where(enabledFilter)
    .orderBy(sql`${ragChunks.embedding} <=> ${vectorExpr}`)
    .limit(RAG_RETRIEVE_VECTOR_LIMIT);

  return rows.map((row, index) => ({
    chunkId: row.chunkId,
    documentId: row.documentId,
    documentTitle: row.documentTitle,
    documentDescription: row.documentDescription,
    content: row.content,
    rank: index + 1,
  }));
}

async function searchByKeyword(
  query: string,
  enabledOnly: boolean,
): Promise<RankedHit[]> {
  const statusReady = eq(ragDocuments.status, "ready");
  const enabledFilter = enabledOnly
    ? and(statusReady, eq(ragDocuments.enabled, true))
    : statusReady;

  const tsQuery = sql`plainto_tsquery('english', ${query})`;
  const tsVector = sql`to_tsvector('english', ${ragChunks.content})`;

  const rows = await db
    .select({
      chunkId: ragChunks.id,
      documentId: ragChunks.documentId,
      documentTitle: ragDocuments.title,
      documentDescription: ragDocuments.description,
      content: ragChunks.content,
      rank: sql<number>`ts_rank(${tsVector}, ${tsQuery})`,
    })
    .from(ragChunks)
    .innerJoin(ragDocuments, eq(ragChunks.documentId, ragDocuments.id))
    .where(and(enabledFilter, sql`${tsVector} @@ ${tsQuery}`))
    .orderBy(sql`ts_rank(${tsVector}, ${tsQuery}) desc`)
    .limit(RAG_RETRIEVE_KEYWORD_LIMIT);

  return rows.map((row, index) => ({
    chunkId: row.chunkId,
    documentId: row.documentId,
    documentTitle: row.documentTitle,
    documentDescription: row.documentDescription,
    content: row.content,
    rank: index + 1,
  }));
}
