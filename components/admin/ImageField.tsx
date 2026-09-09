"use client";

import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import { mediaLibrary, type MediaLibraryItem } from "@/lib/media-library";
import { cn } from "@/lib/utils";

type ImageFieldProps = {
  label?: string;
  fileName?: string;
  urlName?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  library?: MediaLibraryItem[];
};

function isRemote(url: string) {
  return /^https?:\/\//i.test(url);
}

export function ImageField({
  label = "Image",
  fileName = "image",
  urlName = "imageUrl",
  value,
  onChange,
  required,
  library = mediaLibrary,
}: ImageFieldProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileLabel, setFileLabel] = useState<string | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, MediaLibraryItem[]>();
    for (const item of library) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return [...map.entries()];
  }, [library]);

  const selectedLibraryId =
    library.find((item) => item.url === value || item.localPath === value)?.id ??
    "";

  function applyFile(file: File | null) {
    if (!file) {
      setFileLabel(null);
      return;
    }
    setFileLabel(file.name);
    const objectUrl = URL.createObjectURL(file);
    onChange(objectUrl);
  }

  function onLibraryPick(id: string) {
    if (!id) return;
    const item = library.find((entry) => entry.id === id);
    if (!item) return;
    setFileLabel(null);
    if (fileRef.current) fileRef.current.value = "";
    onChange(item.url);
  }

  function clearImage() {
    setFileLabel(null);
    if (fileRef.current) fileRef.current.value = "";
    onChange("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={inputId}>{label}</Label>
        {value ? (
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

      <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
        <div className="relative aspect-square overflow-hidden border border-ink/10 bg-stone/40">
          {value ? (
            isRemote(value) || value.startsWith("/") || value.startsWith("blob:") ? (
              <Image
                src={value}
                alt=""
                fill
                unoptimized={value.startsWith("blob:")}
                className="object-cover"
                sizes="140px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                <ImageIcon className="size-6" />
              </div>
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-muted">
              <ImageIcon className="size-6" />
              <span className="text-[10px] uppercase tracking-[0.16em]">
                No image
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              Library
            </p>
            <select
              value={selectedLibraryId}
              onChange={(event) => onLibraryPick(event.target.value)}
              className="h-11 w-full border border-ink/20 bg-white px-3 text-sm text-ink outline-none transition hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand/20"
              aria-label="Choose from media library"
            >
              <option value="">Select from uploaded media…</option>
              {groups.map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
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
              "flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-5 text-center transition",
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
              {fileLabel ? fileLabel : "Drop an image here, or browse"}
            </p>
            <p className="text-xs text-muted">PNG, JPG, or WebP</p>
          </div>

          <input
            ref={fileRef}
            id={inputId}
            name={fileName}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => applyFile(event.target.files?.[0] ?? null)}
          />

          <div className="space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              Image URL
            </p>
            <input
              name={urlName}
              value={value.startsWith("blob:") ? "" : value}
              onChange={(event) => {
                setFileLabel(null);
                if (fileRef.current) fileRef.current.value = "";
                onChange(event.target.value);
              }}
              required={required && !fileLabel}
              placeholder="https://… or /images/…"
              className="h-11 w-full border border-ink/20 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            {fileLabel ? (
              <p className="text-xs text-muted">
                New upload selected — URL updates after save.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
