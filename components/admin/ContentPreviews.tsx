import Image from "next/image";

import { PreviewFrame } from "@/components/admin/AdminTable";
import type { ArticleBlock } from "@/lib/content/blocks";

export function QuestionHomePreview({
  number,
  question,
  answer,
}: {
  number: string;
  question: string;
  answer: string;
}) {
  return (
    <PreviewFrame label="Homepage question card">
      <div className="mx-auto max-w-xs">
        <div className="flex h-full flex-col border border-ink/20 bg-ivory/40 p-6">
          <p className="font-display text-3xl text-brand">{number}</p>
          <h3 className="mt-5 font-display text-2xl tracking-tight text-ink">
            {question || "Question title"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {answer || "Answer preview…"}
          </p>
        </div>
      </div>
    </PreviewFrame>
  );
}

export function ServiceHomePreview({
  title,
  eyebrow,
  summary,
  imageUrl,
}: {
  title: string;
  eyebrow: string;
  summary: string;
  imageUrl: string;
}) {
  return (
    <PreviewFrame label="Homepage service card">
      <div className="mx-auto max-w-sm">
        <div className="group relative aspect-[4/5] overflow-hidden bg-ink">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="320px"
            />
          ) : (
            <div className="absolute inset-0 bg-brand/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand-light">
              {eyebrow || "Eyebrow"}
            </p>
            <h3 className="mt-2 font-display text-3xl">{title || "Service title"}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ivory/80">
              {summary || "Short summary…"}
            </p>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

export function ServiceDetailPreview({
  title,
  eyebrow,
  summary,
  body,
  imageUrl,
}: {
  title: string;
  eyebrow: string;
  summary: string;
  body: string[];
  imageUrl: string;
}) {
  return (
    <PreviewFrame label="Services page detail section">
      <div className="grid items-center gap-6 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="480px"
            />
          ) : null}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
            {eyebrow || "Eyebrow"}
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            {title || "Service title"}
          </h2>
          <p className="mt-3 text-base text-ink/80">{summary || "Summary…"}</p>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
            {(body.length ? body : ["Detail paragraphs appear here."]).map(
              (para, index) => (
                <p key={`${index}-${para.slice(0, 16)}`}>{para}</p>
              ),
            )}
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

export function TestimonialPreview({
  title,
  quote,
  name,
  source,
}: {
  title: string;
  quote: string;
  name: string;
  source: string;
}) {
  return (
    <PreviewFrame label="Homepage / patients carousel card">
      <div className="mx-auto max-w-md">
        <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
          {title || "Title"}
        </p>
        <blockquote className="mt-5 font-display text-2xl leading-snug text-ink text-balance">
          “{quote || "Patient quote…"}”
        </blockquote>
        <p className="mt-6 text-sm text-muted">
          {name || "Name"}
          <span className="mx-2 opacity-40">·</span>
          {source || "Source"}
        </p>
      </div>
    </PreviewFrame>
  );
}

export function ArticleHomePreview({
  title,
  excerpt,
  category,
  coverImageUrl,
}: {
  title: string;
  excerpt: string;
  category: string;
  coverImageUrl: string;
}) {
  return (
    <PreviewFrame label="Homepage / news card">
      <div className="mx-auto max-w-sm">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="360px"
            />
          ) : null}
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted">
          {category || "Category"}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-snug text-ink">
          {title || "Article title"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {excerpt || "Excerpt…"}
        </p>
      </div>
    </PreviewFrame>
  );
}

export function ArticleDetailPreview({
  title,
  excerpt,
  category,
  coverImageUrl,
  blocks,
}: {
  title: string;
  excerpt: string;
  category: string;
  coverImageUrl: string;
  blocks: ArticleBlock[];
}) {
  const previewBlocks = blocks.slice(0, 4);

  return (
    <PreviewFrame label="Article detail page">
      <div className="space-y-6">
        <div className="relative aspect-[21/9] overflow-hidden bg-ink">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt=""
              fill
              className="object-cover opacity-80"
              sizes="800px"
            />
          ) : null}
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand-light">
              {category || "Category"}
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight">
              {title || "Article title"}
            </h2>
          </div>
        </div>
        <p className="text-base leading-relaxed text-muted">
          {excerpt || "Excerpt…"}
        </p>
        <div className="space-y-4">
          {previewBlocks.length === 0 ? (
            <p className="text-sm text-muted">No body blocks yet.</p>
          ) : (
            previewBlocks.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h3
                    key={index}
                    className="font-display text-2xl tracking-tight text-ink"
                  >
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "paragraph") {
                return (
                  <p key={index} className="text-sm leading-relaxed text-muted">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={index}
                    className="border-l-2 border-brand pl-4 font-display text-xl text-ink"
                  >
                    “{block.text}”
                  </blockquote>
                );
              }
              return (
                <p key={index} className="text-xs uppercase tracking-[0.16em] text-muted">
                  [{block.type} block]
                </p>
              );
            })
          )}
        </div>
      </div>
    </PreviewFrame>
  );
}
