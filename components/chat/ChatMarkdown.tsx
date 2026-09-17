import type { ReactNode } from "react";

type InlineNode =
  | { type: "text"; value: string }
  | { type: "strong"; children: InlineNode[] }
  | { type: "em"; children: InlineNode[] }
  | { type: "link"; href: string; children: InlineNode[] };

function isSafeHref(href: string) {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith("/") || value.startsWith("#")) return true;
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value)) {
    return true;
  }
  return false;
}

function parseInline(input: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let i = 0;

  while (i < input.length) {
    if (input.startsWith("**", i)) {
      const end = input.indexOf("**", i + 2);
      if (end !== -1) {
        nodes.push({
          type: "strong",
          children: parseInline(input.slice(i + 2, end)),
        });
        i = end + 2;
        continue;
      }
    }

    if (input[i] === "*" && input[i + 1] !== "*") {
      const end = input.indexOf("*", i + 1);
      if (end !== -1) {
        nodes.push({
          type: "em",
          children: parseInline(input.slice(i + 1, end)),
        });
        i = end + 1;
        continue;
      }
    }

    if (input[i] === "[") {
      const closeLabel = input.indexOf("]", i + 1);
      if (closeLabel !== -1 && input[closeLabel + 1] === "(") {
        const closeUrl = input.indexOf(")", closeLabel + 2);
        if (closeUrl !== -1) {
          const label = input.slice(i + 1, closeLabel);
          const href = input.slice(closeLabel + 2, closeUrl).trim();
          if (isSafeHref(href)) {
            nodes.push({
              type: "link",
              href,
              children: parseInline(label),
            });
            i = closeUrl + 1;
            continue;
          }
        }
      }
    }

    let next = input.length;
    for (const marker of ["**", "*", "["] as const) {
      const idx = input.indexOf(marker, i + 1);
      if (idx !== -1 && idx < next) next = idx;
    }
    nodes.push({ type: "text", value: input.slice(i, next) });
    i = next;
  }

  return nodes;
}

function renderNodes(nodes: InlineNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.type) {
      case "text":
        return <span key={key}>{node.value}</span>;
      case "strong":
        return <strong key={key}>{renderNodes(node.children, key)}</strong>;
      case "em":
        return <em key={key}>{renderNodes(node.children, key)}</em>;
      case "link":
        return (
          <a
            key={key}
            href={node.href}
            className="font-medium text-brand underline underline-offset-2"
            {...(node.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {renderNodes(node.children, key)}
          </a>
        );
      default:
        return null;
    }
  });
}

function Inline({ text, k }: { text: string; k: string }) {
  return <>{renderNodes(parseInline(text), k)}</>;
}

const UNORDERED = /^[-*+]\s+(.+)$/;
const ORDERED = /^\d+[.)]\s+(.+)$/;

export function ChatMarkdown({ text }: { text: string }) {
  const source = text.trimEnd();
  if (!source.trim()) return null;

  const blocks = source.split(/\n{2,}/);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trimEnd());
        const heading = lines[0]?.match(/^(#{2,3})\s+(.+)$/);
        if (heading) {
          const Tag = heading[1] === "##" ? "h3" : "h4";
          const rest = lines.slice(1).filter(Boolean);
          return (
            <div key={index} className="space-y-2">
              <Tag
                className={
                  heading[1] === "##"
                    ? "font-display text-xl leading-snug text-ink"
                    : "font-display text-lg leading-snug text-ink"
                }
              >
                <Inline text={heading[2] ?? ""} k={`h-${index}`} />
              </Tag>
              {rest.length > 0 ? (
                <p>
                  {rest.map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {lineIndex > 0 ? <br /> : null}
                      <Inline text={line} k={`hbody-${index}-${lineIndex}`} />
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          );
        }

        const unordered = lines.every((line) => UNORDERED.test(line.trim()));
        if (unordered) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  <Inline
                    text={line.trim().replace(UNORDERED, "$1")}
                    k={`u-${index}-${lineIndex}`}
                  />
                </li>
              ))}
            </ul>
          );
        }

        const ordered = lines.every((line) => ORDERED.test(line.trim()));
        if (ordered) {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  <Inline
                    text={line.trim().replace(ORDERED, "$1")}
                    k={`o-${index}-${lineIndex}`}
                  />
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                <Inline text={line} k={`p-${index}-${lineIndex}`} />
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
