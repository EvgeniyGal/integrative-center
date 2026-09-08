"use client";

import { useActionState, useEffect, useState } from "react";

import {
  generateServiceDraftAction,
} from "@/app/admin/actions/ai";
import {
  createServiceAction,
  updateServiceAction,
} from "@/app/admin/actions/services";
import type { ActionState } from "@/app/admin/actions/auth";
import {
  ServiceDetailPreview,
  ServiceHomePreview,
} from "@/components/admin/ContentPreviews";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Service } from "@/lib/db/schema";

export function ServiceEditor({ service }: { service?: Service }) {
  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [eyebrow, setEyebrow] = useState(service?.eyebrow ?? "");
  const [summary, setSummary] = useState(service?.summary ?? "");
  const [body, setBody] = useState((service?.body ?? []).join("\n\n"));
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState(service?.imageUrl ?? "");

  const action = service ? updateServiceAction : createServiceAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);
  const [aiState, aiAction, aiPending] = useActionState(
    generateServiceDraftAction,
    {} as ActionState & { draft?: {
      title: string;
      slug: string;
      eyebrow: string;
      summary: string;
      body: string[];
    } },
  );

  useEffect(() => {
    if (aiState.draft) {
      setTitle(aiState.draft.title);
      setSlug(aiState.draft.slug);
      setEyebrow(aiState.draft.eyebrow);
      setSummary(aiState.draft.summary);
      setBody(aiState.draft.body.join("\n\n"));
    }
  }, [aiState.draft]);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
      <div className="space-y-6 border border-ink/10 bg-ivory p-6">
      <form action={aiAction} className="space-y-3 border-b border-ink/10 pb-6">
        <h3 className="font-display text-xl">AI draft assist</h3>
        <p className="text-sm text-muted">
          Provide notes. The draft fills the form below — review before saving.
        </p>
        <input type="hidden" name="title" value={title} />
        <Textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="What this service includes, who it is for…"
        />
        {aiState.error ? (
          <p className="text-sm text-red-700">{aiState.error}</p>
        ) : null}
        {aiState.success ? (
          <p className="text-sm text-brand-dark">{aiState.success}</p>
        ) : null}
        <Button type="submit" variant="outline" size="sm" disabled={aiPending}>
          {aiPending ? "Generating…" : "Generate draft"}
        </Button>
      </form>

      <form action={formAction} className="space-y-4">
        {service ? <input type="hidden" name="id" value={service.id} /> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`title-${service?.id ?? "new"}`}>Title</Label>
            <Input
              id={`title-${service?.id ?? "new"}`}
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`slug-${service?.id ?? "new"}`}>Slug</Label>
            <Input
              id={`slug-${service?.id ?? "new"}`}
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`eyebrow-${service?.id ?? "new"}`}>Eyebrow</Label>
          <Input
            id={`eyebrow-${service?.id ?? "new"}`}
            name="eyebrow"
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`summary-${service?.id ?? "new"}`}>Summary</Label>
          <Textarea
            id={`summary-${service?.id ?? "new"}`}
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`body-${service?.id ?? "new"}`}>
            Body (paragraphs separated by a blank line)
          </Label>
          <Textarea
            id={`body-${service?.id ?? "new"}`}
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
          />
        </div>
        <ImageField
          label="Service image"
          fileName="image"
          urlName="imageUrl"
          value={imageUrl}
          onChange={setImageUrl}
          required={!service}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={`sort-${service?.id ?? "new"}`}>Sort order</Label>
            <Input
              id={`sort-${service?.id ?? "new"}`}
              name="sortOrder"
              type="number"
              defaultValue={String(service?.sortOrder ?? 0)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm self-end">
            <input
              type="checkbox"
              name="visible"
              defaultChecked={service?.visible ?? true}
            />
            Visible
          </label>
          <label className="flex items-center gap-2 text-sm self-end">
            <input
              type="checkbox"
              name="showOnHome"
              defaultChecked={service?.showOnHome ?? false}
            />
            Show on home
          </label>
        </div>
        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.success ? (
          <p className="text-sm text-brand-dark">{state.success}</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : service ? "Update service" : "Create service"}
        </Button>
      </form>
      </div>

      <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <ServiceHomePreview
          title={title}
          eyebrow={eyebrow}
          summary={summary}
          imageUrl={imageUrl}
        />
        <ServiceDetailPreview
          title={title}
          eyebrow={eyebrow}
          summary={summary}
          body={body
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean)}
          imageUrl={imageUrl}
        />
      </div>
    </div>
  );
}
