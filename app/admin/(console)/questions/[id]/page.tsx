import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { QuestionEditor } from "@/components/admin/QuestionEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { questions } from "@/lib/db/schema";

export const instant = false;

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await db.query.questions.findFirst({
    where: eq(questions.id, id),
  });
  if (!question) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/questions">← Back to questions</Link>
      </Button>
      <QuestionEditor question={question} />
    </div>
  );
}
