import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";

export function LegalPageShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-ivory pt-[7.75rem]">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-12 lg:px-10 lg:pb-32 lg:pt-16">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="legal-policy-content mt-12 text-base leading-relaxed text-muted sm:text-lg">
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
