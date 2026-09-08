import { config } from "dotenv";
config({ path: ".env" });

const { eq } = await import("drizzle-orm");
const { db } = await import("../lib/db");
const { services } = await import("../lib/db/schema");

const order = [
  "diagnostics",
  "iv-therapy",
  "hormone-balancing",
  "weight-management",
  "nutritional-analysis",
  "pelvic-floor",
];

for (const [index, slug] of order.entries()) {
  await db
    .update(services)
    .set({
      sortOrder: index,
      showOnHome: slug !== "diagnostics",
      updatedAt: new Date(),
    })
    .where(eq(services.slug, slug));
  console.log(index, slug);
}
