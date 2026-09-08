import Link from "next/link";

import { QuestionEditor } from "@/components/admin/QuestionEditor";
import { Button } from "@/components/ui/button";

export const instant = false;

export default function NewQuestionPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/questions">← Back to questions</Link>
      </Button>
      <QuestionEditor />
    </div>
  );
}
