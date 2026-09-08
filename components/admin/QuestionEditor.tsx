"use client";

import { useActionState, useState } from "react";

import {
  createQuestionAction,
  updateQuestionAction,
} from "@/app/admin/actions/questions";
import type { ActionState } from "@/app/admin/actions/auth";
import { QuestionHomePreview } from "@/components/admin/ContentPreviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/lib/db/schema";

export function QuestionEditor({ question }: { question?: Question }) {
  const [q, setQ] = useState(question?.question ?? "");
  const [answer, setAnswer] = useState(question?.answer ?? "");
  const action = question ? updateQuestionAction : createQuestionAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form action={formAction} className="space-y-4 border border-ink/10 bg-ivory p-6">
        {question ? <input type="hidden" name="id" value={question.id} /> : null}
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            name="question"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="answer">Answer</Label>
          <Textarea
            id="answer"
            name="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            rows={5}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={String(question?.sortOrder ?? 0)}
            />
          </div>
          <label className="flex items-end gap-2 pb-3 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={question?.published ?? true}
            />
            Published
          </label>
        </div>
        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.success ? (
          <p className="text-sm text-brand-dark">{state.success}</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : question ? "Update question" : "Create question"}
        </Button>
      </form>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <QuestionHomePreview number="1" question={q} answer={answer} />
      </div>
    </div>
  );
}
