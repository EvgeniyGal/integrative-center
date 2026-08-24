import { Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit Health & Beauty Integrative Center at ${site.address.full}, or call ${site.phone}.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate min-h-[50svh] overflow-hidden pt-20">
        <Image
          src="/images/generated/exterior.jpg"
          alt="Sarasota practice setting"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 mx-auto flex min-h-[50svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
              Contact
            </p>
            <h1 className="mt-5 font-display text-5xl text-ivory sm:text-7xl">
              We are ready when you are.
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-12 lg:px-10">
          <Reveal className="lg:col-span-6">
            <SectionHeading
              eyebrow="Write to us"
              title="Fill out a short note. Thank you."
              body="Share what you would like to address. We will respond during business hours."
            />
            <div className="mt-12">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
            <div className="border border-stone bg-white/50 p-8 lg:p-10">
              <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
                The practice
              </p>
              <h2 className="mt-4 font-display text-3xl">{site.name}</h2>
              <ul className="mt-8 space-y-6 text-sm text-muted">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                  <a
                    href={site.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                  <a href={site.phoneHref} className="hover:text-ink">
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-brand" />
                  <div>
                    {site.hours.days.map((row) => (
                      <p key={row.day}>
                        <span className="text-ink">{row.day}</span>
                        <span className="mx-2 text-stone">·</span>
                        {row.time}
                      </p>
                    ))}
                    <p className="mt-1 text-xs">{site.hours.note}</p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Button asChild>
                  <a href={site.phoneHref}>Call the front desk</a>
                </Button>
                <Button asChild variant="outline">
                  <a href={site.portalUrl} target="_blank" rel="noopener noreferrer">
                    Patient Portal
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-stone/30">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="overflow-hidden border border-stone">
            <iframe
              title="Map to Health & Beauty Integrative Center"
              src={site.mapsEmbed}
              className="h-[420px] w-full grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
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
    </>
  );
}
