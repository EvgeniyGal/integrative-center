"use client";

import { FileText, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ACCEPT =
  ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

type DocumentFieldProps = {
  label?: string;
  name?: string;
  hint?: string;
  required?: boolean;
  maxBytes?: number;
  /** Fires when the selected file changes (including clear → null). */
  onFileChange?: (file: File | null) => void;
};

function isAllowedDocument(file: File) {
  const name = file.name.toLowerCase();
  if (
    file.type === "application/pdf" ||
    (file.type === "" && name.endsWith(".pdf")) ||
    name.endsWith(".pdf")
  ) {
    return true;
  }
  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return true;
  }
  if (file.type === "text/plain" || name.endsWith(".txt")) {
    return true;
  }
  return false;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentField({
  label = "File",
  name = "file",
  hint = "PDF, DOCX, or TXT · max 10MB",
  required,
  maxBytes = 10 * 1024 * 1024,
  onFileChange,
}: DocumentFieldProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function clearFile() {
    setFileLabel(null);
    setFileMeta(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
    onFileChange?.(null);
  }

  function applyFile(file: File | null) {
    if (!file) return;

    if (!isAllowedDocument(file)) {
      setError("Choose a PDF, Word (.docx), or TXT file.");
      return;
    }
    if (file.size > maxBytes) {
      setError(
        `File is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB).`,
      );
      return;
    }

    setError(null);
    setFileLabel(file.name);
    setFileMeta(formatBytes(file.size));

    if (fileRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileRef.current.files = transfer.files;
    }

    onFileChange?.(file);
  }

  const hasFile = Boolean(fileLabel);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={inputId}>{label}</Label>
        {hasFile ? (
          <button
            type="button"
            onClick={clearFile}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-muted transition hover:text-ink"
          >
            <X className="size-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
        <div className="relative flex aspect-square flex-col items-center justify-center gap-2 border border-ink/10 bg-stone/40 px-3 text-center">
          <FileText
            className={cn("size-6", hasFile ? "text-brand" : "text-muted")}
          />
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
            {hasFile ? "Ready" : "No file"}
          </span>
          {fileMeta ? (
            <span className="text-[10px] text-muted">{fileMeta}</span>
          ) : null}
        </div>

        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragOver(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            applyFile(event.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "flex h-full min-h-[8.5rem] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-5 text-center transition",
            dragOver
              ? "border-brand bg-brand-light/40"
              : "border-ink/20 bg-stone/20 hover:border-brand/60 hover:bg-stone/35",
          )}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload document"
        >
          <Upload className="size-4 text-brand" />
          <p className="text-sm text-ink">
            {fileLabel
              ? fileLabel
              : "Drop a document here, or browse"}
          </p>
          <p className="text-xs text-muted">{hint}</p>
        </div>

        <input
          ref={fileRef}
          id={inputId}
          name={name}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          required={required}
          onChange={(event) => {
            applyFile(event.target.files?.[0] ?? null);
          }}
        />
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
