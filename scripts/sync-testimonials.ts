import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const { db } = await import("../lib/db");
  const { testimonials } = await import("../lib/db/schema");
  const { reviews } = await import("../lib/site");
  const { asc } = await import("drizzle-orm");

  const existing = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder));

  const existingKeys = new Set(
    existing.map((row) => `${row.name}::${row.title}`.toLowerCase()),
  );

  const toInsert = reviews
    .map((review, index) => ({
      title: review.title,
      quote: review.quote,
      name: review.name,
      source: review.source,
      sortOrder: index,
      published: true,
    }))
    .filter(
      (review) =>
        !existingKeys.has(`${review.name}::${review.title}`.toLowerCase()),
    );

  if (toInsert.length === 0) {
    console.log("No new testimonials to insert");
    return;
  }

  // Keep new items after current max order
  const maxOrder = existing.reduce(
    (max, row) => Math.max(max, row.sortOrder),
    -1,
  );
  const rows = toInsert.map((review, index) => ({
    ...review,
    sortOrder: maxOrder + 1 + index,
  }));

  await db.insert(testimonials).values(rows);
  console.log(`Inserted ${rows.length} testimonials`);
  for (const row of rows) {
    console.log(`- ${row.title} (${row.name})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
