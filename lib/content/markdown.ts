import {
  articleBlocksSchema,
  type ArticleBlock,
} from "@/lib/content/blocks";

export const MARKDOWN_MAX_LENGTH = 100_000;

export type MarkdownParseResult =
  | { ok: true; blocks: ArticleBlock[] }
  | { ok: false; error: string; blocks: ArticleBlock[] };

const YOUTUBE_RE =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})(?:[?&#].*)?$/i;

const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;
const LINK_ONLY_RE = /^\[([^\]]+)\]\(([^)\s]+)\)$/;
const UNORDERED_LIST_RE = /^[-*+]\s+(.+)$/;
const ORDERED_LIST_RE = /^\d+[.)]\s+(.+)$/;

export function extractYoutubeId(url: string): string | null {
  const trimmed = url.trim();
  const match = trimmed.match(YOUTUBE_RE);
  return match?.[1] ?? null;
}

function isYoutubeUrl(line: string) {
  return extractYoutubeId(line) !== null;
}

function parseImageLine(line: string) {
  const match = line.trim().match(IMAGE_LINE_RE);
  if (!match) return null;
  const alt = match[1] ?? "";
  const url = (match[2] ?? "").trim();
  const caption = match[3]?.trim();
  if (!url) {
    throw new Error("Image is missing a URL");
  }
  return { alt, url, caption };
}

function parseImageTextFence(lines: string[], start: number) {
  const open = lines[start] ?? "";
  const headerMatch = open.match(
    /^:::imageText(?:\{([^}]*)\})?\s*$/i,
  );
  if (!headerMatch) return null;

  const attrs = headerMatch[1] ?? "";
  const sideMatch = attrs.match(/side\s*=\s*["']?(left|right)["']?/i);
  const imageMatch = attrs.match(/image\s*=\s*["']([^"']+)["']/i);
  const side = (sideMatch?.[1]?.toLowerCase() === "right" ? "right" : "left") as
    | "left"
    | "right";
  const image = imageMatch?.[1]?.trim() ?? "";
  if (!image) {
    throw new Error("imageText block requires image=\"url\"");
  }

  const body: string[] = [];
  let i = start + 1;
  let closed = false;
  for (; i < lines.length; i++) {
    if (/^:::\s*$/.test(lines[i] ?? "")) {
      closed = true;
      break;
    }
    body.push(lines[i] ?? "");
  }
  if (!closed) {
    throw new Error("Unclosed imageText block (missing closing :::)");
  }

  const nonEmpty = body.map((l) => l.trim()).filter(Boolean);
  if (nonEmpty.length === 0) {
    throw new Error("imageText block needs text content");
  }

  let heading: string | undefined;
  let textLines = nonEmpty;
  if (nonEmpty.length > 1) {
    heading = nonEmpty[0];
    textLines = nonEmpty.slice(1);
  }

  const block: ArticleBlock = {
    type: "imageText",
    heading,
    text: textLines.join("\n\n"),
    image,
    side,
  };

  return { block, nextIndex: i + 1 };
}

function flushParagraph(buffer: string[], blocks: ArticleBlock[]) {
  const text = buffer.join("\n").trim();
  buffer.length = 0;
  if (!text) return;
  blocks.push({ type: "paragraph", text });
}

function flushQuote(buffer: string[], blocks: ArticleBlock[]) {
  if (buffer.length === 0) return;
  const lines = buffer.map((l) => l.replace(/^>\s?/, "").trimEnd());
  buffer.length = 0;

  let attribution: string | undefined;
  const last = lines[lines.length - 1]?.trim() ?? "";
  if (/^(?:—|--|–|-)\s+.+/.test(last) || /^—\s*/.test(last)) {
    attribution = last.replace(/^(?:—|--|–|-)\s*/, "").trim();
    lines.pop();
  }

  const text = lines.join("\n").trim();
  if (!text) {
    throw new Error("Quote block is empty");
  }
  blocks.push({
    type: "quote",
    text,
    ...(attribution ? { attribution } : {}),
  });
}

function flushGallery(
  images: Array<{ url: string; alt: string }>,
  blocks: ArticleBlock[],
) {
  if (images.length === 0) return;
  if (images.length === 1) {
    const image = images[0]!;
    blocks.push({
      type: "image",
      url: image.url,
      alt: image.alt,
      layout: "wide",
    });
  } else {
    blocks.push({ type: "gallery", images: [...images] });
  }
  images.length = 0;
}

function flushList(
  style: "unordered" | "ordered" | null,
  items: string[],
  blocks: ArticleBlock[],
) {
  if (!style || items.length === 0) {
    items.length = 0;
    return;
  }
  const cleaned = items.map((item) => item.trim()).filter(Boolean);
  items.length = 0;
  if (cleaned.length === 0) return;
  blocks.push({
    type: "list",
    style,
    items: cleaned,
  });
}

function parseListItem(trimmed: string): {
  style: "unordered" | "ordered";
  text: string;
} | null {
  const unordered = trimmed.match(UNORDERED_LIST_RE);
  if (unordered?.[1]?.trim()) {
    return { style: "unordered", text: unordered[1].trim() };
  }
  const ordered = trimmed.match(ORDERED_LIST_RE);
  if (ordered?.[1]?.trim()) {
    return { style: "ordered", text: ordered[1].trim() };
  }
  return null;
}

export function markdownToBlocks(markdown: string): ArticleBlock[] {
  const source = typeof markdown === "string" ? markdown : "";
  if (source.length > MARKDOWN_MAX_LENGTH) {
    throw new Error(
      `Markdown is too long (max ${MARKDOWN_MAX_LENGTH.toLocaleString()} characters)`,
    );
  }

  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ArticleBlock[] = [];
  const paragraph: string[] = [];
  const quote: string[] = [];
  const gallery: Array<{ url: string; alt: string }> = [];
  const listItems: string[] = [];
  let listStyle: "unordered" | "ordered" | null = null;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    const imageText = parseImageTextFence(lines, i);
    if (imageText) {
      flushParagraph(paragraph, blocks);
      flushQuote(quote, blocks);
      flushGallery(gallery, blocks);
      flushList(listStyle, listItems, blocks);
      listStyle = null;
      blocks.push(imageText.block);
      i = imageText.nextIndex;
      continue;
    }

    if (!trimmed) {
      flushParagraph(paragraph, blocks);
      flushQuote(quote, blocks);
      flushGallery(gallery, blocks);
      flushList(listStyle, listItems, blocks);
      listStyle = null;
      i += 1;
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      flushParagraph(paragraph, blocks);
      flushQuote(quote, blocks);
      flushGallery(gallery, blocks);
      flushList(listStyle, listItems, blocks);
      listStyle = null;
      const text = trimmed.replace(/^###\s+/, "").trim();
      if (!text) throw new Error("Heading cannot be empty");
      blocks.push({ type: "heading", level: 3, text });
      i += 1;
      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      flushParagraph(paragraph, blocks);
      flushQuote(quote, blocks);
      flushGallery(gallery, blocks);
      flushList(listStyle, listItems, blocks);
      listStyle = null;
      const text = trimmed.replace(/^##\s+/, "").trim();
      if (!text) throw new Error("Heading cannot be empty");
      blocks.push({ type: "heading", level: 2, text });
      i += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph(paragraph, blocks);
      flushGallery(gallery, blocks);
      flushList(listStyle, listItems, blocks);
      listStyle = null;
      quote.push(trimmed);
      i += 1;
      continue;
    }

    if (quote.length > 0) {
      flushQuote(quote, blocks);
    }

    const listItem = parseListItem(trimmed);
    if (listItem) {
      flushParagraph(paragraph, blocks);
      flushGallery(gallery, blocks);
      if (listStyle && listStyle !== listItem.style) {
        flushList(listStyle, listItems, blocks);
      }
      listStyle = listItem.style;
      listItems.push(listItem.text);
      i += 1;
      continue;
    }

    if (listItems.length > 0) {
      flushList(listStyle, listItems, blocks);
      listStyle = null;
    }

    const image = parseImageLine(trimmed);
    if (image) {
      flushParagraph(paragraph, blocks);
      gallery.push({ url: image.url, alt: image.alt });
      i += 1;
      continue;
    }

    if (gallery.length > 0) {
      flushGallery(gallery, blocks);
    }

    if (isYoutubeUrl(trimmed)) {
      flushParagraph(paragraph, blocks);
      const videoId = extractYoutubeId(trimmed);
      if (!videoId) {
        throw new Error(`Invalid YouTube URL: ${trimmed}`);
      }
      blocks.push({
        type: "video",
        provider: "youtube",
        url: trimmed,
        videoId,
      });
      i += 1;
      continue;
    }

    // Reject obviously broken link/image remnants
    if (/^!\[[^\]]*$/.test(trimmed) || /^\[[^\]]+\]\([^)]*$/.test(trimmed)) {
      throw new Error(`Incomplete Markdown link or image: ${trimmed}`);
    }
    if (LINK_ONLY_RE.test(trimmed) && !trimmed.includes("](")) {
      throw new Error(`Incomplete Markdown link: ${trimmed}`);
    }

    paragraph.push(line);
    i += 1;
  }

  flushParagraph(paragraph, blocks);
  flushQuote(quote, blocks);
  flushGallery(gallery, blocks);
  flushList(listStyle, listItems, blocks);

  return blocks;
}

export function blocksToMarkdown(blocks: ArticleBlock[] | null | undefined): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";

  const parts: string[] = [];

  for (const block of blocks) {
    if (!block || typeof block !== "object" || !("type" in block)) continue;

    switch (block.type) {
      case "heading": {
        const level = block.level === 3 ? "###" : "##";
        const text = String(block.text ?? "").trim();
        if (text) parts.push(`${level} ${text}`);
        break;
      }
      case "paragraph": {
        const text = String(block.text ?? "").trim();
        if (text) parts.push(text);
        break;
      }
      case "image": {
        const alt = String(block.alt ?? "");
        const url = String(block.url ?? "").trim();
        if (!url) break;
        const caption = block.caption ? ` "${block.caption}"` : "";
        parts.push(`![${alt}](${url}${caption})`);
        break;
      }
      case "gallery": {
        const images = Array.isArray(block.images) ? block.images : [];
        const lines = images
          .map((image) => {
            const alt = String(image?.alt ?? "");
            const url = String(image?.url ?? "").trim();
            return url ? `![${alt}](${url})` : null;
          })
          .filter(Boolean);
        if (lines.length) parts.push(lines.join("\n"));
        break;
      }
      case "imageText": {
        const image = String(block.image ?? "").trim();
        const side = block.side === "right" ? "right" : "left";
        const heading = block.heading ? `${block.heading}\n\n` : "";
        const text = String(block.text ?? "").trim();
        if (!image || !text) break;
        parts.push(
          `:::imageText{side=${side} image="${image}"}\n${heading}${text}\n:::`,
        );
        break;
      }
      case "quote": {
        const text = String(block.text ?? "").trim();
        if (!text) break;
        const quoteLines = text.split("\n").map((l) => `> ${l}`);
        if (block.attribution) {
          quoteLines.push(`> — ${block.attribution}`);
        }
        parts.push(quoteLines.join("\n"));
        break;
      }
      case "video": {
        const url = String(block.url ?? "").trim();
        if (url) parts.push(url);
        break;
      }
      case "list": {
        const items = Array.isArray(block.items) ? block.items : [];
        const lines = items
          .map((item, index) => {
            const text = String(item ?? "").trim();
            if (!text) return null;
            return block.style === "ordered"
              ? `${index + 1}. ${text}`
              : `- ${text}`;
          })
          .filter(Boolean);
        if (lines.length) parts.push(lines.join("\n"));
        break;
      }
      default:
        break;
    }
  }

  return parts.join("\n\n");
}

export function safeParseMarkdown(markdown: unknown): MarkdownParseResult {
  try {
    const source = typeof markdown === "string" ? markdown : "";
    if (source.length > MARKDOWN_MAX_LENGTH) {
      return {
        ok: false,
        error: `Markdown is too long (max ${MARKDOWN_MAX_LENGTH.toLocaleString()} characters)`,
        blocks: [],
      };
    }

    const rawBlocks = markdownToBlocks(source);
    const parsed = articleBlocksSchema.safeParse(rawBlocks);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message = issue
        ? `${issue.path.join(".") || "blocks"}: ${issue.message}`
        : "Invalid article blocks";
      return { ok: false, error: message, blocks: [] };
    }

    return { ok: true, blocks: parsed.data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not parse Markdown",
      blocks: [],
    };
  }
}
