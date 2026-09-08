import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { Button } from "@/components/ui/button";
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
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/news">← Back to news</Link>
      </Button>
      <ArticleEditor article={article} />
    </div>
  );
}
