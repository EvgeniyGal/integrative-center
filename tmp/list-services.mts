import { config } from "dotenv";
config({ path: ".env" });

const { db } = await import("../lib/db");
const { services } = await import("../lib/db/schema");
const { asc } = await import("drizzle-orm");

const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
for (const r of rows) {
  console.log(
    JSON.stringify(
      {
        slug: r.slug,
        title: r.title,
        visible: r.visible,
        showOnHome: r.showOnHome,
        summary: r.summary,
        bodyCount: (r.body as string[] | null)?.length ?? 0,
        imageUrl: r.imageUrl?.slice(0, 70),
      },
      null,
      0,
    ),
  );
}
