import Link from "next/link";

import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { Button } from "@/components/ui/button";

export const instant = false;

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/news">← Back to news</Link>
      </Button>
      <ArticleEditor />
    </div>
  );
}
