"use client";

import { useActionState, useState } from "react";

import {
  createQuestionAction,
  updateQuestionAction,
} from "@/app/admin/actions/questions";
import type { ActionState } from "@/app/admin/actions/auth";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { QuestionHomePreview } from "@/components/admin/ContentPreviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/lib/db/schema";

export function QuestionEditor({ question }: { question?: Question }) {
  const id = question?.id ?? "new";
  const [q, setQ] = useState(question?.question ?? "");
  const [answer, setAnswer] = useState(question?.answer ?? "");
  const action = question ? updateQuestionAction : createQuestionAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <form action={formAction} className="space-y-5">
        {question ? <input type="hidden" name="id" value={question.id} /> : null}

        <AdminSection
          title="Question"
          description="Shown on the homepage questions carousel."
        >
          <AdminField label="Question" htmlFor={`question-${id}`}>
            <Input
              id={`question-${id}`}
              name="question"
              variant="box"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              required
              placeholder="What should patients know?"
            />
          </AdminField>
          <AdminField label="Answer" htmlFor={`answer-${id}`}>
            <Textarea
              id={`answer-${id}`}
              name="answer"
              variant="box"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              rows={6}
              className="min-h-36"
            />
          </AdminField>
        </AdminSection>

        <AdminSection title="Visibility" description="Control order and publishing.">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr]">
            <AdminField label="Sort order" htmlFor={`sort-${id}`}>
              <Input
                id={`sort-${id}`}
                name="sortOrder"
                variant="box"
                type="number"
                defaultValue={String(question?.sortOrder ?? 0)}
              />
            </AdminField>
            <AdminToggle
              name="published"
              label="Published"
              description="Include in the public homepage carousel"
              defaultChecked={question?.published ?? true}
            />
          </div>
        </AdminSection>

        {state.error ? (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="border border-brand/20 bg-brand-light/40 px-3 py-2 text-sm text-brand-dark">
            {state.success}
          </p>
        ) : null}

        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 border border-ink/10 bg-ivory/95 px-4 py-3 shadow-[0_-8px_24px_rgba(28,27,25,0.06)] backdrop-blur">
          <p className="text-xs text-muted">Changes apply after you save.</p>
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : question
                ? "Update question"
                : "Create question"}
          </Button>
        </div>
      </form>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <QuestionHomePreview question={q} answer={answer} />
      </div>
    </div>
  );
}
