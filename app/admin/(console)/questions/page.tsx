import { AddQuestionButton } from "@/components/admin/QuestionNav";
import { QuestionsTable } from "@/components/admin/QuestionsTable";
import { getAllQuestions } from "@/lib/content/queries";

export const instant = false;

export default async function AdminQuestionsPage() {
  const items = await getAllQuestions();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          These cards appear on the homepage. Drag to set order; toggle status
          to publish or hide.
        </p>
        <AddQuestionButton className="rounded-none" />
      </div>
      <QuestionsTable items={items} />
    </div>
  );
}
