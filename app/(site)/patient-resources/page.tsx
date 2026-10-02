import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList, Laptop } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { getPublishedCareGuides } from "@/lib/content/queries";
import { pageMetadata, pages } from "@/lib/seo";
import { patientResources, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.patientResources);

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 text-brand" aria-hidden>
      {children}
    </div>
  );
}

export default async function PatientResourcesPage() {
  const { hero, intro, beforeVisit, forms, supplements, careGuides, portal } =
    patientResources;
  const guides = await getPublishedCareGuides();

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

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
              {supplements.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink text-balance sm:text-5xl">
              {supplements.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {supplements.body}
            </p>
            <Button asChild className="mt-8">
              <Link href={supplements.ctaHref}>{supplements.ctaLabel}</Link>
            </Button>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/3] overflow-hidden bg-stone">
              <Image
                src={supplements.image}
                alt={supplements.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {guides.length > 0 ? (
        <section className="bg-stone/40 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
                {careGuides.eyebrow}
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-tight text-ink text-balance sm:text-5xl">
                {careGuides.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {careGuides.body}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6">
              {guides.map((guide, index) => {
                const href =
                  guide.actionType === "pdf"
                    ? guide.pdfUrl ?? "#"
                    : guide.linkUrl ?? "#";
                return (
                  <Reveal key={guide.id} delay={0.05 * Math.min(index, 4)}>
                    <article className="flex h-full items-start gap-4 border border-ink/10 bg-white px-5 py-5 sm:gap-5 sm:px-6 sm:py-6">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-brand-light sm:size-24">
                        <Image
                          src={guide.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-2xl tracking-tight text-ink text-balance">
                          {guide.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                          {guide.description}
                        </p>
                        <Button asChild className="mt-5">
                          {guide.actionType === "pdf" ? (
                            <a
                              href={href}
                              download={guide.pdfFileName || undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {guide.ctaLabel}
                            </a>
                          ) : (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {guide.ctaLabel}
                            </a>
                          )}
                        </Button>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section
        className={`${guides.length > 0 ? "bg-ivory" : "bg-stone/40"} py-24 lg:py-32`}
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <Reveal className="h-full">
            <div className="flex h-full flex-col border border-ink/10 bg-white px-6 py-8 shadow-[0_18px_50px_-28px_rgba(28,27,25,0.35)] sm:px-8 sm:py-10">
              <div className="flex flex-1 items-start gap-3 sm:gap-4">
                <SectionIcon>
                  <ClipboardList className="size-12 sm:size-14" strokeWidth={1.25} />
                </SectionIcon>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
                    {forms.eyebrow}
                  </p>
                  <h2 className="mt-4 font-display text-3xl tracking-tight text-ink text-balance sm:text-4xl">
                    {forms.title}
                  </h2>
                  <p className="mt-4 max-w-md flex-1 text-base leading-relaxed text-muted">
                    {forms.body}
                  </p>
                  <Button asChild className="mt-6 self-start">
                    <Link href={forms.ctaHref}>{forms.ctaLabel}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="h-full" delay={0.08}>
            <div className="flex h-full flex-col border border-ink/10 bg-white px-6 py-8 shadow-[0_18px_50px_-28px_rgba(28,27,25,0.35)] sm:px-8 sm:py-10">
              <div className="flex flex-1 items-start gap-3 sm:gap-4">
                <SectionIcon>
                  <Laptop className="size-12 sm:size-14" strokeWidth={1.25} />
                </SectionIcon>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
                    {portal.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                    {portal.title}
                  </h2>
                  <p className="mt-3 max-w-md flex-1 text-base leading-relaxed text-muted">
                    {portal.body}
                  </p>
                  <Button asChild className="mt-6 self-start">
                    <a
                      href={site.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics="portal_click"
                    >
                      {portal.ctaLabel}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
