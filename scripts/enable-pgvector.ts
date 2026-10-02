/**
 * Enable pgvector on Neon before pushing RAG tables.
 * Usage: npx tsx scripts/enable-pgvector.ts
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
  console.log("pgvector extension is enabled.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
