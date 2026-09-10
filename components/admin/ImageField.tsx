"use client";

import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import { useId, useRef, useState, useTransition } from "react";

import { uploadAdminImageAction } from "@/app/admin/actions/media";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImageFieldProps = {
  label?: string;
  /** Hidden form field that carries the persisted image URL. */
  urlName?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  /** Blob folder used for immediate upload (e.g. services, articles). */
  uploadFolder: string;
};

function isPreviewable(url: string) {
  return (
    /^https?:\/\//i.test(url) ||
    url.startsWith("/") ||
    url.startsWith("blob:")
  );
}

export function ImageField({
  label = "Image",
  urlName = "imageUrl",
  value,
  onChange,
  required,
  uploadFolder,
}: ImageFieldProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();

  function clearImage() {
    setFileLabel(null);
    setUploadError(null);
    if (fileRef.current) fileRef.current.value = "";
    onChange("");
  }

  function applyFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file.");
      return;
    }

    setUploadError(null);
    setFileLabel(file.name);
    const previewUrl = URL.createObjectURL(file);
    onChange(previewUrl);

    startUpload(async () => {
      const formData = new FormData();
      formData.set("image", file);
      formData.set("folder", uploadFolder);
      const result = await uploadAdminImageAction(formData);

      URL.revokeObjectURL(previewUrl);

      if (result.error || !result.url) {
        setUploadError(result.error ?? "Upload failed.");
        setFileLabel(null);
        onChange("");
        if (fileRef.current) fileRef.current.value = "";
        return;
      }

      setFileLabel(null);
      onChange(result.url);
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  const hasImage = Boolean(value);
  const storedUrl = value.startsWith("blob:") ? "" : value;
  const ready = Boolean(storedUrl);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={inputId}>{label}</Label>
        {hasImage ? (
          <button
            type="button"
            onClick={clearImage}
            disabled={uploading}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-muted transition hover:text-ink disabled:opacity-50"
          >
            <X className="size-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      <input type="hidden" name={urlName} value={storedUrl} />

      <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
        <div className="relative aspect-square overflow-hidden border border-ink/10 bg-stone/40">
          {hasImage && isPreviewable(value) ? (
            <Image
              src={value}
              alt=""
              fill
              unoptimized={value.startsWith("blob:")}
              className="object-cover"
              sizes="140px"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-muted">
              <ImageIcon className="size-6" />
              <span className="text-[10px] uppercase tracking-[0.16em]">
                No image
              </span>
            </div>
          )}
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/45 text-xs uppercase tracking-[0.16em] text-ivory">
              Uploading…
            </div>
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
            if (uploading) return;
            const file = event.dataTransfer.files?.[0] ?? null;
            if (!file || !file.type.startsWith("image/")) return;
            applyFile(file);
          }}
          className={cn(
            "flex h-full min-h-[8.5rem] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-5 text-center transition",
            uploading && "pointer-events-none opacity-70",
            dragOver
              ? "border-brand bg-brand-light/40"
              : "border-ink/20 bg-stone/20 hover:border-brand/60 hover:bg-stone/35",
          )}
          onClick={() => {
            if (!uploading) fileRef.current?.click();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!uploading) fileRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload image"
        >
          <Upload className="size-4 text-brand" />
          <p className="text-sm text-ink">
            {uploading
              ? "Uploading…"
              : fileLabel
                ? fileLabel
                : ready
                  ? "Replace image — drop or browse"
                  : "Drop an image here, or browse"}
          </p>
          <p className="text-xs text-muted">PNG, JPG, or WebP — saved as WebP</p>
        </div>

        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          required={required && !ready}
          disabled={uploading}
          onChange={(event) => {
            applyFile(event.target.files?.[0] ?? null);
            event.target.value = "";
          }}
        />
      </div>

      {uploadError ? (
        <p className="text-sm text-red-700">{uploadError}</p>
      ) : null}
      {value.startsWith("blob:") && uploading ? (
        <p className="text-xs text-muted">Saving image to library…</p>
      ) : null}
    </div>
  );
}
