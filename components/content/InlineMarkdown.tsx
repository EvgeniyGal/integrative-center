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
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value)) return true;
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
            className="text-brand underline underline-offset-2 transition hover:text-brand-dark"
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

/** Safe inline markdown: text, **bold**, *italic*, [label](url). Never throws. */
export function InlineMarkdown({ text }: { text: string }) {
  try {
    const source = typeof text === "string" ? text : "";
    if (!source) return null;
    return <>{renderNodes(parseInline(source), "n")}</>;
  } catch {
    return <>{typeof text === "string" ? text : ""}</>;
  }
}
