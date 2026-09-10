import { QuestionEditor } from "@/components/admin/QuestionEditor";
import { BackToQuestionsLink } from "@/components/admin/QuestionNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToQuestionsLink>← Back to questions</BackToQuestionsLink>
      </Button>
      <QuestionEditor key={t ?? "new"} />
    </div>
  );
}
