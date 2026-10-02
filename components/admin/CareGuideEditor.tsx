"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  createCareGuideAction,
  updateCareGuideAction,
} from "@/app/admin/actions/care-guides";
import { uploadAdminDocumentAction } from "@/app/admin/actions/media";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CareGuide } from "@/lib/db/schema";

export function CareGuideEditor({ guide }: { guide?: CareGuide }) {
  const router = useRouter();
  const id = guide?.id ?? "new";
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(guide?.imageUrl ?? "");
  const [title, setTitle] = useState(guide?.title ?? "");
  const [description, setDescription] = useState(guide?.description ?? "");
  const [ctaLabel, setCtaLabel] = useState(
    guide?.ctaLabel ?? "View Instructions",
  );
  const [actionType, setActionType] = useState<"link" | "pdf">(
    guide?.actionType ?? "link",
  );
  const [linkUrl, setLinkUrl] = useState(guide?.linkUrl ?? "");
  const [pdfUrl, setPdfUrl] = useState(guide?.pdfUrl ?? "");
  const [pdfFileName, setPdfFileName] = useState(guide?.pdfFileName ?? "");
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfUploading, startPdfUpload] = useTransition();

  const action = guide ? updateCareGuideAction : createCareGuideAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  useEffect(() => {
    if (!guide && state.success) {
      router.push("/admin/care-guides");
      router.refresh();
    }
  }, [guide, state.success, router]);

  function onPdfSelected(file: File | null) {
    if (!file) return;
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    startPdfUpload(async () => {
      setPdfError(null);
      const fd = new FormData();
      fd.set("document", file);
      fd.set("folder", "care-guides/documents");
      const result = await uploadAdminDocumentAction(fd);
      if (result.error || !result.url || !result.fileName) {
        setPdfError(result.error ?? "PDF upload failed.");
        return;
      }
      setPdfUrl(result.url);
      setPdfFileName(result.fileName);
    });
  }

  const imageReady = Boolean(imageUrl) && !imageUrl.startsWith("blob:");
  const actionReady =
    actionType === "link"
      ? Boolean(linkUrl.trim())
      : Boolean(pdfUrl.trim() && pdfFileName.trim());

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      {guide ? <input type="hidden" name="id" value={guide.id} /> : null}
      <input type="hidden" name="actionType" value={actionType} />
      <input type="hidden" name="pdfUrl" value={pdfUrl} />
      <input type="hidden" name="pdfFileName" value={pdfFileName} />

      <AdminSection
        title="Guide"
        description="Card shown in Patient Care Guides on the patient resources page."
      >
        <ImageField
          label="Image"
          urlName="imageUrl"
          uploadFolder="care-guides"
          value={imageUrl}
          onChange={setImageUrl}
          required={!guide}
        />
        <AdminField label="Title" htmlFor={`title-${id}`}>
          <Input
            id={`title-${id}`}
            name="title"
            variant="box"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="How to Give Yourself an Injection"
          />
        </AdminField>
        <AdminField label="Description" htmlFor={`description-${id}`}>
          <Textarea
            id={`description-${id}`}
            name="description"
            variant="box"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Step-by-step instructions for safely administering your prescribed injection at home."
          />
        </AdminField>
        <AdminField label="Button label" htmlFor={`cta-${id}`}>
          <Input
            id={`cta-${id}`}
            name="ctaLabel"
            variant="box"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            required
            placeholder="View Instructions"
          />
        </AdminField>
      </AdminSection>

      <AdminSection
        title="Button action"
        description="Choose an external link (opens in a new tab) or a downloadable PDF."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={actionType === "link" ? "default" : "outline"}
            onClick={() => setActionType("link")}
          >
            External link
          </Button>
          <Button
            type="button"
            size="sm"
            variant={actionType === "pdf" ? "default" : "outline"}
            onClick={() => setActionType("pdf")}
          >
            PDF download
          </Button>
        </div>

        {actionType === "link" ? (
          <AdminField
            label="URL"
            htmlFor={`link-${id}`}
            hint="YouTube, Instagram, or any web page."
          >
            <Input
              id={`link-${id}`}
              name="linkUrl"
              variant="box"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              required
              placeholder="https://"
            />
          </AdminField>
        ) : (
          <div className="space-y-3">
            {pdfUrl ? (
              <div className="flex items-start justify-between gap-3 border border-ink/10 bg-white/70 px-3 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="size-4 shrink-0 text-brand" />
                  <p className="truncate text-sm text-ink">
                    {pdfFileName || "Document.pdf"}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-1 text-muted transition hover:bg-ink/5 hover:text-ink"
                  aria-label="Remove PDF"
                  onClick={() => {
                    setPdfUrl("");
                    setPdfFileName("");
                  }}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted">No PDF uploaded yet.</p>
            )}
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(event) =>
                onPdfSelected(event.target.files?.[0] ?? null)
              }
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pdfUploading}
              onClick={() => pdfInputRef.current?.click()}
            >
              <FileText className="size-3.5" />
              {pdfUploading ? "Uploading…" : pdfUrl ? "Replace PDF" : "Upload PDF"}
            </Button>
            {pdfError ? (
              <p className="text-sm text-red-700">{pdfError}</p>
            ) : null}
          </div>
        )}
      </AdminSection>

      <AdminSection title="Visibility" description="Control order and publishing.">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr]">
          <AdminField label="Sort order" htmlFor={`sort-${id}`}>
            <Input
              id={`sort-${id}`}
              name="sortOrder"
              variant="box"
              type="number"
              defaultValue={String(guide?.sortOrder ?? 0)}
            />
          </AdminField>
          <AdminToggle
            name="published"
            label="Published"
            description="Show on the patient resources page"
            defaultChecked={guide?.published ?? true}
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
          {!imageReady
            ? "Add an image before saving."
            : !actionReady
              ? actionType === "pdf"
                ? "Upload a PDF before saving."
                : "Add a link URL before saving."
              : "Changes apply after you save."}
        </p>
        <Button
          type="submit"
          disabled={pending || !imageReady || !actionReady || pdfUploading}
        >
          {pending ? "Saving…" : guide ? "Update guide" : "Create guide"}
        </Button>
      </div>
    </form>
  );
}
