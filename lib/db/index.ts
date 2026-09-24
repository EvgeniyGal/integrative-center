import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined;
};

// Recreate in development so schema HMR updates `db.query.*` (e.g. new tables).
export const db =
  process.env.NODE_ENV === "production"
    ? (globalForDb.db ?? (globalForDb.db = createDb()))
    : createDb();
