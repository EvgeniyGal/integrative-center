"use client";

import { useActionState, useState } from "react";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  createTestimonialAction,
  updateTestimonialAction,
} from "@/app/admin/actions/testimonials";
import { TestimonialPreview } from "@/components/admin/ContentPreviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Testimonial } from "@/lib/db/schema";

export function TestimonialEditor({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const [title, setTitle] = useState(testimonial?.title ?? "");
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const [name, setName] = useState(testimonial?.name ?? "");
  const [source, setSource] = useState(testimonial?.source ?? "Google Review");
  const action = testimonial
    ? updateTestimonialAction
    : createTestimonialAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,400px)]">
      <form action={formAction} className="space-y-4 border border-ink/10 bg-ivory p-6">
        {testimonial ? (
          <input type="hidden" name="id" value={testimonial.id} />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quote">Quote</Label>
          <Textarea
            id="quote"
            name="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
            rows={5}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              name="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={String(testimonial?.sortOrder ?? 0)}
            />
          </div>
          <label className="flex items-end gap-2 pb-3 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={testimonial?.published ?? true}
            />
            Published
          </label>
        </div>
        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.success ? (
          <p className="text-sm text-brand-dark">{state.success}</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : testimonial
              ? "Update testimonial"
              : "Create testimonial"}
        </Button>
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
