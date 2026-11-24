/**
 * Re-encrypt site_settings.openaiApiKeyEncrypted from OLD_AUTH_SECRET → AUTH_SECRET.
 * Usage: npx tsx scripts/reencrypt-openai-key.ts
 */
import { config } from "dotenv";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

const SALT = "hbi-ai-settings-v1";

function keyFrom(secret: string) {
  return scryptSync(secret, SALT, 32);
}

function decryptWith(secret: string, payload: string): string {
  const [ivPart, tagPart, dataPart] = payload.split(".");
  if (!ivPart || !tagPart || !dataPart) {
    throw new Error("Stored API key is invalid.");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    keyFrom(secret),
    Buffer.from(ivPart, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataPart, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function encryptWith(secret: string, plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFrom(secret), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const oldSecret = process.env.OLD_AUTH_SECRET;
  const newSecret = process.env.AUTH_SECRET;

  if (!dbUrl) throw new Error("DATABASE_URL required");
  if (!oldSecret) throw new Error("OLD_AUTH_SECRET required");
  if (!newSecret) throw new Error("AUTH_SECRET required");
  if (oldSecret === newSecret) {
    console.log("Secrets are identical; nothing to re-encrypt.");
    return;
  }

  const sql = neon(dbUrl);
  const rows = await sql`
    SELECT id, "openaiApiKeyEncrypted" AS enc
    FROM site_settings
    WHERE "openaiApiKeyEncrypted" IS NOT NULL
  `;

  if (rows.length === 0) {
    console.log("No encrypted OpenAI key found.");
    return;
  }

  for (const row of rows) {
    const enc = row.enc as string;
    const plain = decryptWith(oldSecret, enc);
    const next = encryptWith(newSecret, plain);
    await sql`
      UPDATE site_settings
      SET "openaiApiKeyEncrypted" = ${next}, "updatedAt" = NOW()
      WHERE id = ${row.id as string}
    `;
    console.log(`Re-encrypted OpenAI key for site_settings id=${row.id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
