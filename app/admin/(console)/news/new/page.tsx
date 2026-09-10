import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { BackToNewsLink } from "@/components/admin/ArticleNav";

export const instant = false;

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <BackToNewsLink />
      <ArticleEditor key={t ?? "new"} />
    </div>
  );
}
