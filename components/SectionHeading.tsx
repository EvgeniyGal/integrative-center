import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  body?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-4 text-[11px] font-medium uppercase tracking-[0.32em]",
            light ? "text-brand-light" : "text-brand",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-4xl leading-[1.1] tracking-tight text-balance sm:text-5xl",
          light ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            light ? "text-ivory/75" : "text-muted",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
