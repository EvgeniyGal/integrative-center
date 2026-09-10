"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  createTestimonialAction,
  updateTestimonialAction,
} from "@/app/admin/actions/testimonials";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { TestimonialPreview } from "@/components/admin/ContentPreviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Testimonial } from "@/lib/db/schema";

export function TestimonialEditor({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const router = useRouter();
  const id = testimonial?.id ?? "new";
  const [title, setTitle] = useState(testimonial?.title ?? "");
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const [name, setName] = useState(testimonial?.name ?? "");
  const [source, setSource] = useState(testimonial?.source ?? "Google Review");
  const action = testimonial
    ? updateTestimonialAction
    : createTestimonialAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  useEffect(() => {
    if (!testimonial && state.success) {
      router.push("/admin/testimonials");
      router.refresh();
    }
  }, [testimonial, state.success, router]);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)]">
      <form action={formAction} className="space-y-5">
        {testimonial ? (
          <input type="hidden" name="id" value={testimonial.id} />
        ) : null}

        <AdminSection
          title="Quote"
          description="Shown in the patient testimonials carousel."
        >
          <AdminField label="Title" htmlFor={`title-${id}`}>
            <Input
              id={`title-${id}`}
              name="title"
              variant="box"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Short headline"
            />
          </AdminField>
          <AdminField label="Quote" htmlFor={`quote-${id}`}>
            <Textarea
              id={`quote-${id}`}
              name="quote"
              variant="box"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
              rows={6}
              className="min-h-36"
            />
          </AdminField>
        </AdminSection>

        <AdminSection title="Attribution" description="Who said it, and where.">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Name" htmlFor={`name-${id}`}>
              <Input
                id={`name-${id}`}
                name="name"
                variant="box"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </AdminField>
            <AdminField label="Source" htmlFor={`source-${id}`}>
              <Input
                id={`source-${id}`}
                name="source"
                variant="box"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
            </AdminField>
          </div>
        </AdminSection>

        <AdminSection title="Visibility" description="Control order and publishing.">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr]">
            <AdminField label="Sort order" htmlFor={`sort-${id}`}>
              <Input
                id={`sort-${id}`}
                name="sortOrder"
                variant="box"
                type="number"
                defaultValue={String(testimonial?.sortOrder ?? 0)}
              />
            </AdminField>
            <AdminToggle
              name="published"
              label="Published"
              description="Include in public carousels"
              defaultChecked={testimonial?.published ?? true}
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
              : testimonial
                ? "Update testimonial"
                : "Create testimonial"}
          </Button>
        </div>
      </form>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <TestimonialPreview
          title={title}
          quote={quote}
          name={name}
          source={source}
        />
      </div>
    </div>
  );
}
