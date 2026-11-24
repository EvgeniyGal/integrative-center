/**
 * One-shot migration: old Neon + Blob → NEW_* targets, then rewrite blob URLs.
 *
 * Usage: npx tsx scripts/migrate-to-new-env.ts
 *
 * Reads from .env:
 *   DATABASE_URL, BLOB_READ_WRITE_TOKEN  (source)
 *   NEW_DATABASE_URL, NEW_BLOB_READ_WRITE_TOKEN (destination)
 */
import { config } from "dotenv";
import { list, put } from "@vercel/blob";
import pg from "pg";

config({ path: ".env.local" });
config({ path: ".env" });

const SOURCE_DB = process.env.DATABASE_URL;
const DEST_DB = process.env.NEW_DATABASE_URL;
const SOURCE_BLOB = process.env.BLOB_READ_WRITE_TOKEN?.replace(/^"|"$/g, "");
const DEST_BLOB = process.env.NEW_BLOB_READ_WRITE_TOKEN?.replace(/^"|"$/g, "");

if (!SOURCE_DB || !DEST_DB) {
  throw new Error("DATABASE_URL and NEW_DATABASE_URL are required");
}
if (!SOURCE_BLOB || !DEST_BLOB) {
  throw new Error(
    "BLOB_READ_WRITE_TOKEN and NEW_BLOB_READ_WRITE_TOKEN are required",
  );
}

/** Prefer direct Neon endpoint for bulk copy (no -pooler). */
function toDirectUrl(url: string) {
  return url.replace("-pooler.", ".");
}

const TABLE_ORDER = [
  "users",
  "accounts",
  "sessions",
  "verificationTokens",
  "admin_invites",
  "password_reset_tokens",
  "questions",
  "services",
  "policies",
  "testimonials",
  "articles",
  "supplement_brands",
  "care_guides",
  "patient_forms",
  "team_members",
  "product_categories",
  "store_brands",
  "site_settings",
  "recommended_products",
  "notification_recipients",
  "contact_submissions",
  "newsletter_subscribers",
  "analytics_events",
  "rag_documents",
  "rag_chunks",
] as const;

async function listAllBlobs(token: string) {
  const blobs: Array<{
    url: string;
    pathname: string;
    contentType?: string;
    size: number;
  }> = [];
  let cursor: string | undefined;
  do {
    const page = await list({ token, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      blobs.push({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: blob.size,
      });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;
  if (Buffer.isBuffer(value)) return value;
  // pg returns jsonb as objects; vector may come back as number[]
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

async function truncateDest(dest: pg.Pool, tables: string[]) {
  const existing = await dest.query<{ tablename: string }>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  );
  const set = new Set(existing.rows.map((t) => t.tablename));
  const toClear = tables.filter((t) => set.has(t)).reverse();
  if (toClear.length === 0) return;
  await dest.query(
    `TRUNCATE ${toClear.map((t) => `"${t}"`).join(", ")} CASCADE`,
  );
  console.log(`  Truncated ${toClear.length} destination tables`);
}

async function copyTable(
  source: pg.Pool,
  dest: pg.Pool,
  table: string,
): Promise<number> {
  const { rows } = await source.query(`SELECT * FROM "${table}"`);
  if (rows.length === 0) {
    console.log(`  ${table}: 0 rows`);
    return 0;
  }

  const columns = Object.keys(rows[0]!);
  const colList = columns.map((c) => `"${c}"`).join(", ");
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const sql = `INSERT INTO "${table}" (${colList}) VALUES (${placeholders})`;

  let inserted = 0;
  for (const row of rows) {
    const values = columns.map((c) => serializeValue(row[c]));
    const result = await dest.query(sql, values);
    inserted += result.rowCount ?? 0;
  }
  console.log(`  ${table}: ${inserted}/${rows.length} rows`);
  return inserted;
}

async function rewriteBlobUrls(
  dest: pg.Pool,
  urlMap: Map<string, string>,
): Promise<number> {
  if (urlMap.size === 0) return 0;

  // Build hostname map from sample URLs (store ID changes; path usually same).
  const hostPairs = new Map<string, string>();
  for (const [oldUrl, newUrl] of urlMap) {
    try {
      const oldHost = new URL(oldUrl).host;
      const newHost = new URL(newUrl).host;
      if (oldHost !== newHost) hostPairs.set(oldHost, newHost);
    } catch {
      /* ignore */
    }
  }

  const textColumns: Array<{ table: string; column: string }> = [
    { table: "services", column: "imageUrl" },
    { table: "articles", column: "coverImageUrl" },
    { table: "supplement_brands", column: "logoUrl" },
    { table: "care_guides", column: "imageUrl" },
    { table: "care_guides", column: "pdfUrl" },
    { table: "patient_forms", column: "pdfUrl" },
    { table: "team_members", column: "imageUrl" },
    { table: "store_brands", column: "logoUrl" },
    { table: "recommended_products", column: "imageUrl" },
    { table: "rag_documents", column: "blobUrl" },
    { table: "users", column: "image" },
  ];

  const jsonbColumns: Array<{ table: string; column: string }> = [
    { table: "articles", column: "blocks" },
    { table: "services", column: "body" },
    { table: "policies", column: "body" },
  ];

  let updates = 0;

  for (const { table, column } of textColumns) {
    const exists = await dest.query(
      `SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
      [table, column],
    );
    if (exists.rowCount === 0) continue;

    for (const [oldHost, newHost] of hostPairs) {
      const result = await dest.query(
        `UPDATE "${table}"
         SET "${column}" = REPLACE("${column}", $1, $2)
         WHERE "${column}" LIKE $3`,
        [oldHost, newHost, `%${oldHost}%`],
      );
      updates += result.rowCount ?? 0;
    }

    for (const [oldUrl, newUrl] of urlMap) {
      if (oldUrl === newUrl) continue;
      const result = await dest.query(
        `UPDATE "${table}" SET "${column}" = $1 WHERE "${column}" = $2`,
        [newUrl, oldUrl],
      );
      updates += result.rowCount ?? 0;
    }
  }

  for (const { table, column } of jsonbColumns) {
    const exists = await dest.query(
      `SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
      [table, column],
    );
    if (exists.rowCount === 0) continue;

    for (const [oldHost, newHost] of hostPairs) {
      const result = await dest.query(
        `UPDATE "${table}"
         SET "${column}" = REPLACE("${column}"::text, $1, $2)::jsonb
         WHERE "${column}"::text LIKE $3`,
        [oldHost, newHost, `%${oldHost}%`],
      );
      updates += result.rowCount ?? 0;
    }
  }

  return updates;
}

async function ensureSchema(destUrl: string) {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(destUrl);
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  console.log("Enabled pgvector on destination");

  // Push Drizzle schema against destination (config reads DATABASE_URL)
  const { execSync } = await import("child_process");
  execSync("npx drizzle-kit push --force", {
    stdio: "inherit",
    cwd: process.cwd(),
    env: {
      ...process.env,
      DATABASE_URL: destUrl,
    },
  });
}

async function main() {
  console.log("=== Migrate Neon DB + Vercel Blob to NEW_* targets ===\n");

  const sourceUrl = toDirectUrl(SOURCE_DB!);
  const destUrl = toDirectUrl(DEST_DB!);

  console.log("1) Ensuring destination schema...");
  await ensureSchema(DEST_DB!);

  const source = new pg.Pool({
    connectionString: sourceUrl,
    ssl: { rejectUnauthorized: false },
  });
  const dest = new pg.Pool({
    connectionString: destUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Discover which tables actually exist on source
    const { rows: sourceTables } = await source.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
    );
    const sourceSet = new Set(sourceTables.map((t) => t.tablename));

    console.log("\n2) Copying table data...");
    const tablesToCopy = TABLE_ORDER.filter((t) => sourceSet.has(t));
    await truncateDest(dest, [...tablesToCopy]);
    for (const table of tablesToCopy) {
      await copyTable(source, dest, table);
    }

    // Any other public tables not in the ordered list
    for (const table of sourceSet) {
      if ((TABLE_ORDER as readonly string[]).includes(table)) continue;
      if (table.startsWith("__drizzle")) continue;
      console.log(`  Extra table ${table}...`);
      await copyTable(source, dest, table);
    }

    console.log("\n3) Listing + copying blobs...");
    const sourceBlobs = await listAllBlobs(SOURCE_BLOB!);
    console.log(`  Found ${sourceBlobs.length} blobs on source store`);

    const urlMap = new Map<string, string>();
    let copied = 0;
    let failed = 0;

    for (const blob of sourceBlobs) {
      try {
        const res = await fetch(blob.url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const body = Buffer.from(await res.arrayBuffer());
        const uploaded = await put(blob.pathname, body, {
          access: "public",
          token: DEST_BLOB!,
          contentType: blob.contentType || "application/octet-stream",
          addRandomSuffix: false,
          allowOverwrite: true,
        });
        urlMap.set(blob.url, uploaded.url);
        copied += 1;
        if (copied % 10 === 0 || copied === sourceBlobs.length) {
          console.log(`  Copied ${copied}/${sourceBlobs.length}`);
        }
      } catch (error) {
        failed += 1;
        console.error(`  Failed ${blob.pathname}:`, error);
      }
    }
    console.log(`  Blob copy done: ${copied} ok, ${failed} failed`);

    console.log("\n4) Rewriting blob URLs in destination DB...");
    const rewritten = await rewriteBlobUrls(dest, urlMap);
    console.log(`  Updated ${rewritten} column values`);

    // Quick sanity counts
    console.log("\n5) Row counts (dest):");
    for (const table of ["users", "services", "articles", "rag_documents"]) {
      if (!sourceSet.has(table)) continue;
      const { rows } = await dest.query(`SELECT COUNT(*)::int AS c FROM "${table}"`);
      console.log(`  ${table}: ${rows[0]!.c}`);
    }

    console.log("\nMigration complete. Next: promote NEW_* env vars and reseed admin.");
  } finally {
    await source.end();
    await dest.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
