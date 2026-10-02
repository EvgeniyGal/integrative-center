/**
 * Create RAG tables and indexes (idempotent).
 * Usage: npx tsx scripts/setup-rag-schema.ts
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(url);

  await sql`CREATE EXTENSION IF NOT EXISTS vector`;

  await sql`
    CREATE TABLE IF NOT EXISTS rag_documents (
      id text PRIMARY KEY,
      title text NOT NULL,
      description text,
      "blobUrl" text NOT NULL,
      "fileName" text NOT NULL,
      "mimeType" text NOT NULL,
      "byteSize" integer NOT NULL,
      enabled boolean NOT NULL DEFAULT true,
      status text NOT NULL DEFAULT 'processing',
      error text,
      "chunkCount" integer NOT NULL DEFAULT 0,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rag_chunks (
      id text PRIMARY KEY,
      "documentId" text NOT NULL REFERENCES rag_documents(id) ON DELETE CASCADE,
      "chunkIndex" integer NOT NULL,
      content text NOT NULL,
      "tokenEstimate" integer NOT NULL DEFAULT 0,
      embedding vector(1536) NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS rag_chunks_document_id_idx
    ON rag_chunks ("documentId")
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS rag_chunks_embedding_hnsw_idx
    ON rag_chunks
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS rag_chunks_content_fts_idx
    ON rag_chunks
    USING gin (to_tsvector('english', content))
  `;

  console.log("RAG schema is ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
