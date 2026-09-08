import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const { db } = await import("../lib/db");
  const { questions } = await import("../lib/db/schema");
  const { homeQuestions } = await import("../lib/site");

  await db.delete(questions);

  await db.insert(questions).values(
    homeQuestions.items.map((item, index) => ({
      question: item.question,
      answer: item.answer,
      sortOrder: index,
      published: true,
    })),
  );

  console.log(`Replaced questions with ${homeQuestions.items.length} real FAQs`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
