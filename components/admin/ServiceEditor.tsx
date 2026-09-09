"use client";

import { useActionState, useEffect, useState } from "react";

import { generateServiceDraftAction } from "@/app/admin/actions/ai";
import {
  createServiceAction,
  updateServiceAction,
} from "@/app/admin/actions/services";
import type { ActionState } from "@/app/admin/actions/auth";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import {
  ServiceDetailPreview,
  ServiceHomePreview,
} from "@/components/admin/ContentPreviews";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Service } from "@/lib/db/schema";

export function ServiceEditor({ service }: { service?: Service }) {
  const id = service?.id ?? "new";
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
    {} as ActionState & {
      draft?: {
        title: string;
        slug: string;
        eyebrow: string;
        summary: string;
        body: string[];
      };
    },
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
      <div className="space-y-5">
        <form
          action={aiAction}
          className="space-y-4 border border-dashed border-brand/35 bg-brand-light/25 p-5"
        >
          <div className="space-y-1">
            <h3 className="font-display text-xl text-ink">AI draft assist</h3>
            <p className="text-sm text-muted">
              Provide notes. The draft fills the form below — review before
              saving.
            </p>
          </div>
          <input type="hidden" name="title" value={title} />
          <AdminField label="Notes" htmlFor={`notes-${id}`}>
            <Textarea
              id={`notes-${id}`}
              name="notes"
              variant="box"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What this service includes, who it is for…"
            />
          </AdminField>
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

        <form action={formAction} className="space-y-5">
          {service ? <input type="hidden" name="id" value={service.id} /> : null}

          <AdminSection
            title="Basics"
            description="Name and URL used across the public site."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Title" htmlFor={`title-${id}`}>
                <Input
                  id={`title-${id}`}
                  name="title"
                  variant="box"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </AdminField>
              <AdminField
                label="Slug"
                htmlFor={`slug-${id}`}
                hint="Leave blank to auto-generate"
              >
                <Input
                  id={`slug-${id}`}
                  name="slug"
                  variant="box"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="iv-therapy"
                />
              </AdminField>
            </div>
            <AdminField label="Eyebrow" htmlFor={`eyebrow-${id}`}>
              <Input
                id={`eyebrow-${id}`}
                name="eyebrow"
                variant="box"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                required
                placeholder="Short label above the title"
              />
            </AdminField>
          </AdminSection>

          <AdminSection
            title="Content"
            description="Summary appears on cards; body paragraphs appear on the service detail."
          >
            <AdminField label="Summary" htmlFor={`summary-${id}`}>
              <Textarea
                id={`summary-${id}`}
                name="summary"
                variant="box"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                rows={3}
              />
            </AdminField>
            <AdminField
              label="Body"
              htmlFor={`body-${id}`}
              hint="Separate paragraphs with a blank line"
            >
              <Textarea
                id={`body-${id}`}
                name="body"
                variant="box"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="min-h-48"
              />
            </AdminField>
          </AdminSection>

          <AdminSection
            title="Media"
            description="Main image for service cards and detail pages."
          >
            <ImageField
              label="Service image"
              fileName="image"
              urlName="imageUrl"
              value={imageUrl}
              onChange={setImageUrl}
              required={!service}
            />
          </AdminSection>

          <AdminSection title="Visibility" description="Control where this service appears.">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr_1fr]">
              <AdminField label="Sort order" htmlFor={`sort-${id}`}>
                <Input
                  id={`sort-${id}`}
                  name="sortOrder"
                  variant="box"
                  type="number"
                  defaultValue={String(service?.sortOrder ?? 0)}
                />
              </AdminField>
              <AdminToggle
                name="visible"
                label="Visible"
                description="Show on the public services page"
                defaultChecked={service?.visible ?? true}
              />
              <AdminToggle
                name="showOnHome"
                label="Show on home"
                description="Include in homepage service cards"
                defaultChecked={service?.showOnHome ?? false}
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
            <p className="text-xs text-muted">
              Changes apply after you save.
            </p>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving…"
                : service
                  ? "Update service"
                  : "Create service"}
            </Button>
          </div>
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
