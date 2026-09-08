import { config } from "dotenv";
config({ path: ".env" });

const { db } = await import("../lib/db");
const { questions } = await import("../lib/db/schema");
const { asc } = await import("drizzle-orm");

const rows = await db.select().from(questions).orderBy(asc(questions.sortOrder));
console.log(`count=${rows.length}`);
for (const r of rows) {
  console.log("---");
  console.log(r.sortOrder, r.published, r.id);
  console.log("Q:", r.question);
  console.log("A:", r.answer.slice(0, 120));
}
