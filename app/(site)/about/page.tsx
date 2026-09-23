import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { aboutPolicies, practiceIntro, team } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.about);

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate min-h-[70svh] overflow-hidden pt-[7.75rem]">
        <Image
          src="/images/generated/about.jpg"
          alt="The Health & Beauty Integrative Center practice"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
              About us
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ivory text-balance sm:text-7xl">
              A private practice for root-cause care.
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="About us"
              title={practiceIntro.title}
            />
          </Reveal>
          <Reveal
            className="space-y-6 text-base leading-relaxed text-muted sm:text-lg lg:col-span-7"
            delay={0.08}
          >
            {practiceIntro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-stone/40 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow={aboutPolicies.eyebrow}
                title={aboutPolicies.title}
                body={aboutPolicies.body}
              />
              <Button asChild className="shrink-0 self-start lg:self-auto">
                <Link href={aboutPolicies.readMoreHref}>Read more</Link>
              </Button>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutPolicies.items.map((policy, index) => (
              <Reveal key={policy.title} delay={index * 0.06}>
                <article className="group flex h-full min-h-[220px] flex-col border border-ink bg-ivory/60 p-6 transition duration-500 ease-out hover:-translate-y-1.5 hover:border-brand hover:bg-ivory hover:shadow-[0_18px_40px_-28px_rgba(28,27,25,0.45)] lg:p-7">
                  <h3 className="font-display text-xl leading-snug tracking-tight text-brand uppercase transition duration-500 group-hover:text-brand-dark sm:text-2xl">
                    {policy.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted transition duration-500 group-hover:text-ink/75">
                    {policy.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="The team"
              title="Meet the people who will know your name."
            />
          </Reveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-16">
            {[team[0], team[0]].map((member, index) => (
              <Reveal key={`${member.name}-${index}`} delay={index * 0.08}>
                <article className="grid gap-6 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:items-start lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone/40">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 13rem, (min-width: 640px) 11rem, 100vw"
                    />
                  </div>
                  <div className="sm:pt-1">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand">
                      {member.role}
                    </p>
                    <h3 className="mt-3 font-display text-2xl tracking-tight text-ink sm:text-3xl">
                      {member.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                      {member.bio}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
