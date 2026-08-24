import { ArrowRight, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { ConsultCta } from "@/components/ConsultCta";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { carePath, site, team } from "@/lib/site";
import { homeServices } from "@/lib/services";

export const metadata: Metadata = pageMetadata(pages.home);

export default function HomePage() {
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src="/images/generated/hero.jpg"
          alt="The Health & Beauty Integrative Center interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
          <p className="text-[11px] uppercase tracking-[0.36em] text-brand-light">
            Sarasota, Florida
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.95] text-ivory text-balance sm:text-7xl lg:text-8xl">
            Greater Sarasota’s finest health & beauty integrative center
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
            Holistic therapies joined with science-backed treatment. We address
            the root cause — then restore how you feel, look, and live.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="inverted" size="lg">
              <Link href="/contact">Request a consult</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="border border-white/25">
              <Link href="/health-and-wellness">Explore care</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-stone bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-3 lg:px-10">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 text-brand" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                Location
              </p>
              <p className="mt-1 text-sm text-ink">{site.address.full}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
              Hours
            </p>
            <p className="mt-1 text-sm text-ink">
              {site.hours.summary}
              <span className="text-muted"> · {site.hours.note}</span>
            </p>
          </div>
          <a href={site.phoneHref} className="flex items-start gap-3 hover:text-brand">
            <Phone className="mt-0.5 size-4 text-brand" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                Concierge
              </p>
              <p className="mt-1 text-sm">{site.phone}</p>
            </div>
          </a>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12 lg:px-10">
          <Reveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={team[0].image}
                alt={team[0].name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted">
              {team[0].name}
            </p>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <SectionHeading
              eyebrow="The practice"
              title="Medicine that listens, then looks deeper."
              body="Elina Belilovskiy, ARNP, leads a practice devoted to the physical and mental health of patients of all ages. We combine holistic therapies with science-backed treatments, using diagnostic testing and personalized plans to target root causes and relieve symptoms."
            />
            <p className="mt-6 max-w-xl text-muted leading-relaxed">
              No matter your concern, our dedicated providers listen to your
              needs and use the latest diagnostic tests to find the source of
              your symptoms.
            </p>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/about">
                Meet the team <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Care"
              title="A complete integrative offering"
              body="Six disciplines, one private practice — designed so internal health and outward vitality move together."
            />
          </Reveal>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.05}>
                <Link
                  href={`/health-and-wellness#${service.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden"
                >
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-brand-light">
                      {service.eyebrow}
                    </p>
                    <h3 className="mt-2 font-display text-3xl">{service.title}</h3>
                    <p className="mt-2 max-w-sm text-sm text-ivory/75 opacity-0 transition duration-500 group-hover:opacity-100">
                      {service.summary}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="The path"
              title="Listen. Diagnose. Personalize. Monitor."
            />
          </Reveal>
          <div className="mt-16 grid gap-px bg-stone sm:grid-cols-2 lg:grid-cols-4">
            {carePath.map((item) => (
              <div key={item.step} className="bg-ivory p-8 lg:p-10">
                <p className="font-display text-4xl text-brand">{item.step}</p>
                <h3 className="mt-6 font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone/40 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading eyebrow="Patients" title="What people are saying" />
          </Reveal>
          <div className="mt-14">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-24 lg:py-32">
        <Image
          src="/images/generated/abstract.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
            Become an insider
          </p>
          <h2 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">
            Specials, events, and news — quietly delivered.
          </h2>
          <div className="mx-auto mt-10 max-w-md">
            <NewsletterForm light />
          </div>
        </div>
      </section>

      <ConsultCta />
    </>
  );
}
