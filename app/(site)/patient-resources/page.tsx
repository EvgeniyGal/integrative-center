import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { patientResources, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.patientResources);

function FormsIllustration() {
  return (
    <svg
      viewBox="0 0 280 240"
      className="mx-auto h-auto w-full max-w-[16rem]"
      role="img"
      aria-label="Clipboard checklist illustration"
    >
      <ellipse cx="140" cy="210" rx="78" ry="12" fill="rgba(7,156,162,0.18)" />
      <path
        d="M48 150c18-42 42-78 92-78s74 36 92 78c-24 18-56 28-92 28s-68-10-92-28Z"
        fill="rgba(7,156,162,0.2)"
      />
      <path
        d="M70 168c22-36 44-58 70-58s48 22 70 58c-18 14-42 22-70 22s-52-8-70-22Z"
        fill="rgba(7,156,162,0.28)"
      />
      <rect
        x="88"
        y="36"
        width="104"
        height="148"
        rx="10"
        fill="#E8F6F7"
        stroke="#9AD6D9"
        strokeWidth="3"
      />
      <rect x="112" y="24" width="56" height="22" rx="6" fill="#079CA2" />
      <rect x="124" y="30" width="32" height="10" rx="3" fill="#E8F6F7" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(0 ${68 + i * 26})`}>
          <rect
            x="108"
            y="0"
            width="16"
            height="16"
            rx="3"
            fill="none"
            stroke="#079CA2"
            strokeWidth="2.5"
          />
          <path
            d="M111 8l3.5 3.5 7-7"
            fill="none"
            stroke="#079CA2"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="136" y="4" width="40" height="8" rx="2" fill="#9AD6D9" />
        </g>
      ))}
      <path
        d="M198 120c8 18 10 34 6 48"
        fill="none"
        stroke="#C4A574"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M198 112l8 4-4 10-8-4z" fill="#079CA2" />
    </svg>
  );
}

export default function PatientResourcesPage() {
  const { hero, intro, beforeVisit, forms, supplements, portal } =
    patientResources;

  return (
    <>
      <section className="relative isolate min-h-[70svh] overflow-hidden pt-[7.75rem]">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
              {hero.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ivory text-balance sm:text-7xl">
              {hero.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-4xl leading-[1.1] tracking-tight text-ink text-balance sm:text-5xl">
              {intro.title}
            </h2>
          </Reveal>
          <Reveal
            className="text-base leading-relaxed text-muted sm:text-lg lg:col-span-7"
            delay={0.08}
          >
            <p>{intro.body}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-stone/40 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
              {beforeVisit.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink text-balance sm:text-5xl">
              {beforeVisit.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {beforeVisit.body}
            </p>
            <Button asChild className="mt-8">
              <Link href={beforeVisit.ctaHref}>{beforeVisit.ctaLabel}</Link>
            </Button>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/3] overflow-hidden bg-stone">
              <Image
                src={beforeVisit.image}
                alt={beforeVisit.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-24 text-ivory lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand-light">
              {forms.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance sm:text-5xl">
              {forms.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg">
              {forms.body}
            </p>
          </Reveal>
          <Reveal className="text-center" delay={0.08}>
            <FormsIllustration />
            <Button asChild variant="inverted" className="mt-8">
              <Link href={forms.ctaHref}>{forms.ctaLabel}</Link>
            </Button>
            <p className="mt-4 text-sm text-ivory/60">{forms.note}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-stone/40 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
              {supplements.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-ink text-balance sm:text-4xl">
              {supplements.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              {supplements.body}
            </p>
            <Button asChild className="mt-8">
              <Link href={supplements.ctaHref}>{supplements.ctaLabel}</Link>
            </Button>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border border-ink/10 bg-ivory px-6 py-8 shadow-[0_18px_50px_-28px_rgba(28,27,25,0.35)] sm:px-8 sm:py-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
                {portal.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                {portal.title}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                {portal.body}
              </p>
              <Button asChild className="mt-8">
                <a
                  href={site.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {portal.ctaLabel}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
