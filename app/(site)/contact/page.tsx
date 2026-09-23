import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.contact);

export default function ContactPage() {
  return (
    <section className="bg-ivory pt-[7.75rem] pb-24 lg:pb-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-12 lg:px-10 lg:py-24">
        <Reveal className="lg:col-span-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
              Write to us
            </p>
            <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-balance text-ink sm:text-5xl">
              Fill out a short note. Thank you.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              Share what you would like to address. We will respond during
              business hours.
            </p>
          </div>
          <div className="mt-12">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
          <div className="border border-stone bg-white/50 p-8 lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
              The practice
            </p>
            <h2 className="mt-4 font-display text-3xl text-ink">{site.name}</h2>
            <ul className="mt-8 space-y-6 text-sm text-muted">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <Link href="/location" className="hover:text-ink">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </Link>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                <a
                  href={site.phoneHref}
                  data-analytics="phone_click"
                  className="hover:text-ink"
                >
                  {site.phone}
                </a>
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <Button asChild>
                <a href={site.phoneHref} data-analytics="phone_click">
                  Call the front desk
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={site.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics="portal_click"
                >
                  Patient Portal
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
