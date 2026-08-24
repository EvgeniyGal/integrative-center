import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { ConsultCta } from "@/components/ConsultCta";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { wellnessServices } from "@/lib/services";

export const metadata: Metadata = pageMetadata(pages.wellness);

export default function WellnessPage() {
  return (
    <>
      <section className="relative isolate min-h-[70svh] overflow-hidden pt-20">
        <Image
          src="/images/generated/reception.jpg"
          alt="A private consult setting"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
              Health & wellness
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ivory text-balance sm:text-7xl">
              Care tailored to the person in front of us.
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              title="Feel and look your best at any age."
              body="Maintaining our health means providing the body with the care it needs. Since each person is unique, we provide personalized health and wellness care — a wide range of services for physical, mental, and emotional well-being."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              Improving your health begins with you. Taking the next step
              begins with us. Access our team of health and wellness experts —
              using the latest technology and innovative therapies — for a
              customized care experience that addresses your individual concerns.
            </p>
          </Reveal>
          <nav className="mt-14 flex flex-wrap gap-3">
            {wellnessServices.map((service) => (
              <a
                key={service.slug}
                href={`#${service.slug}`}
                className="rounded-full border border-ink/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink/80 transition hover:border-brand hover:text-brand"
              >
                {service.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {wellnessServices.map((service, index) => {
        const reverse = index % 2 === 1;
        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`scroll-mt-24 ${index % 2 === 0 ? "bg-ivory" : "bg-stone/30"}`}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10 lg:py-28">
              <Reveal
                className={
                  reverse
                    ? "relative aspect-[4/3] overflow-hidden lg:col-span-6 lg:order-2"
                    : "relative aspect-[4/3] overflow-hidden lg:col-span-6"
                }
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </Reveal>
              <Reveal
                className={
                  reverse ? "lg:col-span-6 lg:order-1" : "lg:col-span-6"
                }
                delay={0.08}
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
                  {service.eyebrow}
                </p>
                <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                  {service.title}
                </h2>
                <p className="mt-4 text-lg text-ink/80">{service.summary}</p>
                <div className="mt-6 space-y-4 text-muted leading-relaxed">
                  {service.body.map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-8">
                  <Link href="/contact">Request this consult</Link>
                </Button>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Patients" title="What people are saying" />
          <div className="mt-14">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      <ConsultCta
        title="Improving your health begins with you."
        body="The next step begins with us. Tell us what you would like to address."
      />
    </>
  );
}
