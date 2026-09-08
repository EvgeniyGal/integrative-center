import Link from "next/link";

import { QuestionsTable } from "@/components/admin/QuestionsTable";
import { Button } from "@/components/ui/button";
import { getAllQuestions } from "@/lib/content/queries";

export const instant = false;

export default async function AdminQuestionsPage() {
  const items = await getAllQuestions();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          These cards appear on the homepage. Numbers are derived from published
          sort order on the public site.
        </p>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/admin/questions/new">Add question</Link>
        </Button>
      </div>
      <QuestionsTable items={items} />
    </div>
  );
}
