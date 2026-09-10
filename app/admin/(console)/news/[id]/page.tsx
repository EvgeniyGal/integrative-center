import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { BackToNewsLink } from "@/components/admin/ArticleNav";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";

export const instant = false;

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <BackToNewsLink />
      <ArticleEditor article={article} />
    </div>
  );
}
