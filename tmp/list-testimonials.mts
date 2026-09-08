import { config } from "dotenv";
config({ path: ".env" });

const { db } = await import("../lib/db");
const { testimonials } = await import("../lib/db/schema");
const { asc } = await import("drizzle-orm");

const rows = await db
  .select()
  .from(testimonials)
  .orderBy(asc(testimonials.sortOrder));
console.log(`count=${rows.length}`);
for (const r of rows) {
  console.log("---", r.sortOrder, r.published);
  console.log(r.title, "|", r.name, "|", r.source);
  console.log(r.quote.slice(0, 100));
}
