import { config } from "dotenv";
import { randomUUID } from "crypto";

config({ path: ".env.local" });
config({ path: ".env" });

/** Migrate products from per-row store logo/cta to shared store_brands. */
async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS store_brands (
      id text PRIMARY KEY NOT NULL,
      name text NOT NULL UNIQUE,
      "logoUrl" text NOT NULL,
      "ctaLabel" text NOT NULL,
      "sortOrder" integer DEFAULT 0 NOT NULL,
      published boolean DEFAULT true NOT NULL,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp DEFAULT now() NOT NULL
    )
  `;

  const existingBrands = await sql`SELECT id FROM store_brands LIMIT 1`;
  let amazonId: string;

  if (existingBrands.length === 0) {
    amazonId = randomUUID();
    await sql`
      INSERT INTO store_brands (id, name, "logoUrl", "ctaLabel", "sortOrder", published)
      VALUES (${amazonId}, 'Amazon', '/images/amazon.svg', 'VIEW ON AMAZON', 0, true)
    `;
    console.log("Created Amazon store brand");
  } else {
    const amazon = await sql`SELECT id FROM store_brands WHERE name = 'Amazon' LIMIT 1`;
    if (amazon.length > 0) {
      amazonId = amazon[0].id as string;
    } else {
      const any = await sql`SELECT id FROM store_brands ORDER BY "sortOrder" ASC LIMIT 1`;
      amazonId = any[0].id as string;
    }
    console.log("Using existing store brand", amazonId);
  }

  const hasStoreBrandId = await sql`
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recommended_products' AND column_name = 'storeBrandId'
    LIMIT 1
  `;

  if (hasStoreBrandId.length === 0) {
    await sql`
      ALTER TABLE recommended_products
      ADD COLUMN "storeBrandId" text
    `;
    await sql`
      UPDATE recommended_products
      SET "storeBrandId" = ${amazonId}
      WHERE "storeBrandId" IS NULL
    `;
    await sql`
      ALTER TABLE recommended_products
      ALTER COLUMN "storeBrandId" SET NOT NULL
    `;
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'recommended_products_storeBrandId_store_brands_id_fk'
        ) THEN
          ALTER TABLE recommended_products
            ADD CONSTRAINT recommended_products_storeBrandId_store_brands_id_fk
            FOREIGN KEY ("storeBrandId") REFERENCES store_brands(id) ON DELETE RESTRICT;
        END IF;
      END $$;
    `;
    console.log("Added storeBrandId and backfilled products");
  } else {
    await sql`
      UPDATE recommended_products
      SET "storeBrandId" = ${amazonId}
      WHERE "storeBrandId" IS NULL
    `;
    console.log("storeBrandId already present");
  }

  await sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'recommended_products' AND column_name = 'storeLogoUrl'
      ) THEN
        ALTER TABLE recommended_products DROP COLUMN "storeLogoUrl";
      END IF;
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'recommended_products' AND column_name = 'ctaLabel'
      ) THEN
        ALTER TABLE recommended_products DROP COLUMN "ctaLabel";
      END IF;
    END $$;
  `;

  console.log("Dropped per-product storeLogoUrl and ctaLabel");
  console.log("Migration complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
