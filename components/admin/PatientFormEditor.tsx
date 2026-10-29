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
  createPatientFormAction,
  updatePatientFormAction,
} from "@/app/admin/actions/patient-forms";
import { uploadAdminDocumentAction } from "@/app/admin/actions/media";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PatientForm } from "@/lib/db/schema";

export function PatientFormEditor({ form }: { form?: PatientForm }) {
  const router = useRouter();
  const id = form?.id ?? "new";
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(form?.title ?? "");
  const [description, setDescription] = useState(form?.description ?? "");
  const [pdfUrl, setPdfUrl] = useState(form?.pdfUrl ?? "");
  const [pdfFileName, setPdfFileName] = useState(form?.pdfFileName ?? "");
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfUploading, startPdfUpload] = useTransition();

  const action = form ? updatePatientFormAction : createPatientFormAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  useEffect(() => {
    if (!form && state.success) {
      router.push("/admin/patient-forms");
      router.refresh();
    }
  }, [form, state.success, router]);

  function onPdfSelected(file: File | null) {
    if (!file) return;
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    startPdfUpload(async () => {
      setPdfError(null);
      const fd = new FormData();
      fd.set("document", file);
      fd.set("folder", "patient-forms/documents");
      const result = await uploadAdminDocumentAction(fd);
      if (result.error || !result.url || !result.fileName) {
        setPdfError(result.error ?? "PDF upload failed.");
        return;
      }
      setPdfUrl(result.url);
      setPdfFileName(result.fileName);
    });
  }

  const pdfReady = Boolean(pdfUrl) && !pdfUrl.startsWith("blob:");

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      {form ? <input type="hidden" name="id" value={form.id} /> : null}
      <input type="hidden" name="pdfUrl" value={pdfUrl} />
      <input type="hidden" name="pdfFileName" value={pdfFileName} />

      <AdminSection
        title="Form"
        description="Card shown on the patient forms page with PDF preview and download."
      >
        <AdminField label="Title" htmlFor={`title-${id}`}>
          <Input
            id={`title-${id}`}
            name="title"
            variant="box"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="New Patient Intake Form"
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
            placeholder="Complete this form before your first appointment so we can prepare for your visit."
          />
        </AdminField>
      </AdminSection>

      <AdminSection
        title="PDF document"
        description="Upload the downloadable PDF patients will preview and save."
      >
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
      </AdminSection>

      <AdminSection title="Visibility" description="Control order and publishing.">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr]">
          <AdminField label="Sort order" htmlFor={`sort-${id}`}>
            <Input
              id={`sort-${id}`}
              name="sortOrder"
              variant="box"
              type="number"
              defaultValue={String(form?.sortOrder ?? 0)}
            />
          </AdminField>
          <AdminToggle
            name="published"
            label="Published"
            description="Show on the patient forms page"
            defaultChecked={form?.published ?? true}
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
          {!pdfReady
            ? "Upload a PDF before saving."
            : "Changes apply after you save."}
        </p>
        <Button
          type="submit"
          disabled={pending || !pdfReady || pdfUploading}
        >
          {pending ? "Saving…" : form ? "Update form" : "Create form"}
        </Button>
      </div>
    </form>
  );
}
