"use client";

import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImageFieldProps = {
  label?: string;
  fileName?: string;
  urlName?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
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
  fileName = "image",
  urlName = "imageUrl",
  value,
  onChange,
  required,
}: ImageFieldProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileLabel, setFileLabel] = useState<string | null>(null);

  function applyFile(file: File | null) {
    if (!file) {
      setFileLabel(null);
      return;
    }
    setFileLabel(file.name);
    const objectUrl = URL.createObjectURL(file);
    onChange(objectUrl);
  }

  function clearImage() {
    setFileLabel(null);
    if (fileRef.current) fileRef.current.value = "";
    onChange("");
  }

  const hasImage = Boolean(value);
  const storedUrl = value.startsWith("blob:") ? "" : value;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={inputId}>{label}</Label>
        {hasImage ? (
          <button
            type="button"
            onClick={clearImage}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-muted transition hover:text-ink"
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
            const file = event.dataTransfer.files?.[0] ?? null;
            if (!file || !file.type.startsWith("image/")) return;
            if (fileRef.current) {
              const transfer = new DataTransfer();
              transfer.items.add(file);
              fileRef.current.files = transfer.files;
            }
            applyFile(file);
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
          aria-label="Upload image"
        >
          <Upload className="size-4 text-brand" />
          <p className="text-sm text-ink">
            {fileLabel
              ? fileLabel
              : hasImage
                ? "Replace image — drop or browse"
                : "Drop an image here, or browse"}
          </p>
          <p className="text-xs text-muted">PNG, JPG, or WebP — saved as WebP</p>
        </div>

        <input
          ref={fileRef}
          id={inputId}
          name={fileName}
          type="file"
          accept="image/*"
          className="sr-only"
          required={required && !hasImage}
          onChange={(event) => applyFile(event.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
