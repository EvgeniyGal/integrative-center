import Image from "next/image";

import { InlineMarkdown } from "@/components/content/InlineMarkdown";
import type { ArticleBlock } from "@/lib/content/blocks";

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {blocks.map((block, index) => {
        if (!block || typeof block !== "object" || !("type" in block)) {
          return null;
        }

        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "heading":
            return block.level === 2 ? (
              <h2
                key={key}
                className="font-display text-4xl tracking-tight text-ink sm:text-5xl"
              >
                <InlineMarkdown text={block.text} />
              </h2>
            ) : (
              <h3
                key={key}
                className="font-display text-3xl tracking-tight text-ink"
              >
                <InlineMarkdown text={block.text} />
              </h3>
            );
          case "paragraph":
            return (
              <p
                key={key}
                className="max-w-3xl text-base leading-relaxed text-muted sm:text-lg"
              >
                <InlineMarkdown text={block.text} />
              </p>
            );
          case "image":
            if (!block.url) return null;
            return (
              <figure key={key} className="space-y-3">
                <div
                  className={`relative overflow-hidden ${
                    block.layout === "full"
                      ? "aspect-[21/9]"
                      : "aspect-[16/9] max-w-4xl"
                  }`}
                >
                  <Image
                    src={block.url}
                    alt={block.alt || ""}
                    fill
                    className="object-cover"
                    sizes="100vw"
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
            return (
              <div
                key={key}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
            return (
              <div
                key={key}
                className="grid items-center gap-10 lg:grid-cols-2"
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
                    <h3 className="font-display text-3xl tracking-tight text-ink">
                      <InlineMarkdown text={block.heading} />
                    </h3>
                  ) : null}
                  <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                    <InlineMarkdown text={block.text} />
                  </p>
                </div>
              </div>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                className="border-l-2 border-brand pl-6 font-display text-2xl leading-snug text-ink sm:text-3xl"
              >
                “
                <InlineMarkdown text={block.text} />
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
            return (
              <div key={key} className="mx-auto w-full max-w-4xl">
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
          default:
            return null;
        }
      })}
    </div>
  );
}
