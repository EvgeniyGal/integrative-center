import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { officePoliciesPage } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.officePolicies);

const EMPHASIS = [
  "24 hours’ notice",
  "24 hours' notice",
  "$50 no-show fee",
  "three no-shows",
  "15-minute grace period",
  "20 minutes late",
  "two rounds of clarification",
  "one business day",
  "one to two business days",
  "three to four business days",
  "24 to 48 business hours",
  "call 911",
  "every 6 months",
  "every 3 months",
  "scheduled patient only",
  "one week",
  "24 hours before the scheduled appointment",
] as const;

function emphasize(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let matchIndex = -1;
    let matchText = "";

    for (const phrase of EMPHASIS) {
      const index = remaining.indexOf(phrase);
      if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
        matchIndex = index;
        matchText = phrase;
      }
    }

    if (matchIndex === -1) {
      parts.push(remaining);
      break;
    }

    if (matchIndex > 0) {
      parts.push(remaining.slice(0, matchIndex));
    }
    parts.push(
      <strong key={`e-${key++}`} className="font-semibold text-ink">
        {matchText}
      </strong>,
    );
    remaining = remaining.slice(matchIndex + matchText.length);
  }

  return parts;
}

export default function OfficePoliciesPage() {
  const { eyebrow, title, intro, toc, sections } = officePoliciesPage;

  return (
    <section className="bg-ivory pt-[7.75rem]">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-12 lg:px-10 lg:pb-32 lg:pt-16">
        <Reveal>
          <Button asChild variant="outline" size="sm" className="rounded-none">
            <Link href="/patient-resources">← Back to patient resources</Link>
          </Button>
          <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            {intro}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <nav
            aria-label="Office policies sections"
            className="mt-10 border border-brand bg-white px-4 py-4 sm:px-5"
          >
            <ul className="flex flex-wrap items-center justify-center gap-y-2 text-center text-sm leading-relaxed text-ink">
              {toc.map((item, index) => (
                <li key={item.id} className="inline-flex items-center">
                  <a
                    href={`#${item.id}`}
                    className="px-1 text-ink/80 transition hover:text-brand"
                  >
                    {item.label}
                  </a>
                  {index < toc.length - 1 ? (
                    <span className="px-1.5 text-brand/50" aria-hidden>
                      |
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <div className="mt-14">
          {sections.map((section, index) => {
            const isLast = index === sections.length - 1;
            return (
              <Reveal key={section.id} delay={Math.min(index * 0.02, 0.18)}>
                <article
                  id={section.id}
                  className={
                    isLast
                      ? "scroll-mt-28 pt-16 sm:pt-20"
                      : "scroll-mt-28 border-b border-ink/15 py-16 sm:py-20"
                  }
                >
                  <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                    {section.title}
                  </h2>
                  {section.blocks.map((block, blockIndex) => {
                    if (block.type === "heading") {
                      return (
                        <h3
                          key={`${section.id}-h-${blockIndex}`}
                          className="mt-8 font-display text-2xl tracking-tight text-ink sm:text-3xl"
                        >
                          {block.text}
                        </h3>
                      );
                    }
                    if (block.type === "bullets") {
                      return (
                        <ul
                          key={`${section.id}-ul-${blockIndex}`}
                          className="mt-5 list-disc space-y-2 pl-6 text-base leading-relaxed text-muted sm:text-lg"
                        >
                          {block.items.map((item) => (
                            <li key={item}>{emphasize(item)}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p
                        key={`${section.id}-p-${blockIndex}`}
                        className="mt-5 text-base leading-relaxed text-muted sm:text-lg"
                      >
                        {emphasize(block.text)}
                      </p>
                    );
                  })}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
