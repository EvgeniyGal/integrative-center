import { ArticlesTable } from "@/components/admin/ArticlesTable";
import { AddArticleButton } from "@/components/admin/ArticleNav";
import { getAllArticles } from "@/lib/content/queries";

export const instant = false;

export default async function AdminNewsPage() {
  const items = await getAllArticles();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Draft, publish, and feature articles on the homepage. Body content uses
          structured blocks.
        </p>
        <AddArticleButton className="rounded-none" />
      </div>
      <ArticlesTable items={items} />
    </div>
  );
}
