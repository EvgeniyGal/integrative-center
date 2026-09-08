import Image from "next/image";
import type { Metadata } from "next";

import { ConsultCta } from "@/components/ConsultCta";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { pageMetadata, pages } from "@/lib/seo";
import { modalities, site, team } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.about);

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate min-h-[70svh] overflow-hidden pt-[7.75rem]">
        <Image
          src="/images/generated/about.jpg"
          alt="The HBI practice"
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
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-12 lg:px-10">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Our practice"
              title="Functional and traditional medicine, held to a clinical standard."
            />
          </Reveal>
          <Reveal className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-7" delay={0.1}>
            <p>{site.description}</p>
            <p>
              Using a variety of modalities, we address the root causes of our
              patients’ issues while helping to reduce their symptoms. Every
              patient is unique. Our dedicated providers listen, then use the
              latest diagnostic testing to identify the source of your issues.
            </p>
            <p>
              Once we assess your health factors, we develop comprehensive
              treatment plans personalized to your needs. During your treatments,
              we monitor your progress and adjust the process based on your
              body’s response.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-stone/30 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="Founder"
              title="Elina Belilovskiy, ARNP"
              body="Family Medicine Nurse Practitioner. Autonomous license. A practice built on diagnosis first."
            />
          </Reveal>
          <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="relative aspect-[4/5] overflow-hidden lg:col-span-5">
              <Image
                src={team[0].image}
                alt={team[0].name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </Reveal>
            <Reveal className="lg:col-span-7" delay={0.1}>
              <p className="text-lg leading-relaxed text-muted">{team[0].bio}</p>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {["Integrative Medicine", "Women’s Health", "Urology", "Anti-aging protocols"].map(
                  (item) => (
                    <li
                      key={item}
                      className="border-l border-brand pl-4 text-sm uppercase tracking-[0.16em] text-ink"
                    >
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="The team"
              title="Meet the people who will know your name."
              body="Health & Beauty Integrative Center is led by Elina Belilovskiy, ARNP, and serves patients across a wide range of concerns with personalized, results-driven care."
            />
          </Reveal>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <article className="grid gap-6 sm:grid-cols-5 sm:items-start">
                  <div className="relative aspect-[4/5] overflow-hidden sm:col-span-2">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 20vw, 100vw"
                    />
                  </div>
                  <div className="sm:col-span-3 sm:pt-2">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-brand">
                      {member.role}
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-ink">
                      {member.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {member.bio}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="relative mt-16 aspect-[21/9] overflow-hidden">
            <Image
              src="/images/staff/team.jpg"
              alt="The Health & Beauty Integrative Center team"
              fill
              className="object-cover object-top"
              sizes="100vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Modalities"
              title="Inside and out, designed as one plan."
              body="From our experience in medicine and cosmetology, we know most skin issues begin underneath. We combine aesthetic and health therapies so you feel — and look — your best."
            />
          </Reveal>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modalities.map((item) => (
              <li
                key={item}
                className="border border-white/10 px-6 py-5 text-sm tracking-wide text-ivory/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Patients" title="What people are saying" />
          <div className="mt-14">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      <ConsultCta />
    </>
  );
}
