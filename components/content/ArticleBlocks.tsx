import Image from "next/image";

import { InlineMarkdown } from "@/components/content/InlineMarkdown";
import type { ArticleBlock } from "@/lib/content/blocks";

function stripOuterQuotes(text: string) {
  return text
    .trim()
    .replace(/^[“"‘']+/, "")
    .replace(/[”"'’]+$/, "")
    .trim();
}

type BlockType = ArticleBlock["type"];

/** Prose that should sit close together (paragraphs, lists). */
function isProse(type: BlockType) {
  return type === "paragraph" || type === "list";
}

/** Larger breathing room before section breaks / media. */
function isSectionBreak(type: BlockType) {
  return (
    type === "heading" ||
    type === "quote" ||
    type === "image" ||
    type === "gallery" ||
    type === "imageText" ||
    type === "video"
  );
}

function spacingBefore(
  current: BlockType,
  previous: BlockType | null,
): string {
  if (!previous) return "";
  if (isProse(previous) && isProse(current)) return "mt-4";
  if (isProse(previous) && current === "heading") return "mt-10";
  if (previous === "heading" && isProse(current)) return "mt-4";
  if (isSectionBreak(current) || isSectionBreak(previous)) return "mt-10";
  return "mt-6";
}

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  let previousType: BlockType | null = null;

  return (
    <div>
      {blocks.map((block, index) => {
        if (!block || typeof block !== "object" || !("type" in block)) {
          return null;
        }

        const key = `${block.type}-${index}`;
        const space = spacingBefore(block.type, previousType);

        switch (block.type) {
          case "heading":
            previousType = block.type;
            return block.level === 2 ? (
              <h2
                key={key}
                className={`${space} max-w-3xl break-words font-display text-4xl tracking-tight text-ink text-balance sm:text-5xl`}
              >
                <InlineMarkdown text={block.text} />
              </h2>
            ) : (
              <h3
                key={key}
                className={`${space} max-w-3xl break-words font-display text-3xl tracking-tight text-ink text-balance`}
              >
                <InlineMarkdown text={block.text} />
              </h3>
            );
          case "paragraph":
            previousType = block.type;
            return (
              <p
                key={key}
                className={`${space} max-w-3xl break-words text-base leading-relaxed text-muted sm:text-lg`}
              >
                <InlineMarkdown text={block.text} />
              </p>
            );
          case "image":
            if (!block.url) return null;
            previousType = block.type;
            return (
              <figure key={key} className={`${space} max-w-4xl space-y-3`}>
                <div
                  className={`relative overflow-hidden ${
                    block.layout === "full" ? "aspect-[21/9]" : "aspect-[16/9]"
                  }`}
                >
                  <Image
                    src={block.url}
                    alt={block.alt || ""}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 56rem, 100vw"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="text-sm text-muted">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "gallery":
            if (!block.images?.length) return null;
            previousType = block.type;
            return (
              <div
                key={key}
                className={`${space} grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3`}
              >
                {block.images.map((image, i) =>
                  image?.url ? (
                    <div
                      key={`${key}-${i}`}
                      className="relative aspect-[4/3] overflow-hidden"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || ""}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, 50vw"
                      />
                    </div>
                  ) : null,
                )}
              </div>
            );
          case "imageText":
            if (!block.image || !block.text) return null;
            previousType = block.type;
            return (
              <div
                key={key}
                className={`${space} grid max-w-5xl items-center gap-10 lg:grid-cols-2`}
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden ${
                    block.side === "right" ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={block.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
                <div className={block.side === "right" ? "lg:order-1" : ""}>
                  {block.heading ? (
                    <h3 className="break-words font-display text-3xl tracking-tight text-ink text-balance">
                      <InlineMarkdown text={block.heading} />
                    </h3>
                  ) : null}
                  <p className="mt-4 break-words text-base leading-relaxed text-muted sm:text-lg">
                    <InlineMarkdown text={block.text} />
                  </p>
                </div>
              </div>
            );
          case "quote":
            previousType = block.type;
            return (
              <blockquote
                key={key}
                className={`${space} max-w-3xl break-words border-l-2 border-brand pl-6 font-display text-2xl leading-snug text-ink text-pretty sm:text-3xl`}
              >
                “
                <InlineMarkdown text={stripOuterQuotes(block.text)} />
                ”
                {block.attribution ? (
                  <footer className="mt-4 font-sans text-sm text-muted">
                    {block.attribution}
                  </footer>
                ) : null}
              </blockquote>
            );
          case "video": {
            const id = block.videoId?.trim();
            if (!id) return null;
            previousType = block.type;
            return (
              <div key={key} className={`${space} w-full max-w-4xl`}>
                <div className="relative aspect-video overflow-hidden bg-ink">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
                    title="YouTube video"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            );
          }
          case "list": {
            if (!block.items?.length) return null;
            previousType = block.type;
            const ListTag = block.style === "ordered" ? "ol" : "ul";
            return (
              <ListTag
                key={key}
                className={
                  block.style === "ordered"
                    ? `${space} max-w-3xl list-decimal space-y-2 break-words pl-6 text-base leading-relaxed text-muted sm:text-lg`
                    : `${space} max-w-3xl list-disc space-y-2 break-words pl-6 text-base leading-relaxed text-muted sm:text-lg`
                }
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>
                    <InlineMarkdown text={item} />
                  </li>
                ))}
              </ListTag>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
