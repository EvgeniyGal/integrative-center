import { ArrowRight, Calendar, Laptop, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.location);

const availableStates = ["Florida", "Massachusetts", "Illinois"] as const;
const comingSoonStates = ["New Jersey", "Connecticut"] as const;

export default function LocationPage() {
  return (
    <section className="relative overflow-hidden bg-ivory pt-[7.75rem] pb-24 lg:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-20 h-72 w-72 opacity-40"
      >
        <div className="absolute inset-0 rounded-full bg-brand/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
            Visit us
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
            Our Locations
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Visit our Sarasota office or connect with us through secure
            telehealth appointments in eligible states.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="flex h-full gap-5 rounded-2xl border border-stone/80 bg-white p-8 shadow-[0_16px_48px_-32px_rgba(28,27,25,0.4)] sm:gap-6 lg:p-9">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand sm:size-20">
                <MapPin className="size-8 sm:size-9" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h2 className="font-display text-3xl font-bold text-brand">
                  Sarasota Office
                </h2>
                <div className="mt-5 space-y-1 text-base leading-relaxed text-muted">
                  <p className="font-medium text-ink">{site.name}</p>
                  <p>
                    {site.address.line1}, {site.address.line2}
                  </p>
                  <p>
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </p>
                  <p className="pt-2">
                    <a
                      href={site.phoneHref}
                      data-analytics="phone_click"
                      className="hover:text-ink"
                    >
                      {site.phone}
                    </a>
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <Button asChild>
                    <a
                      href={site.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics="maps_click"
                    >
                      Get Directions
                      <ArrowRight className="size-4" aria-hidden />
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={site.phoneHref} data-analytics="phone_click">
                      Call Us
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="flex h-full gap-5 rounded-2xl border border-stone/80 bg-white p-8 shadow-[0_16px_48px_-32px_rgba(28,27,25,0.4)] sm:gap-6 lg:p-9">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand sm:size-20">
                <Laptop className="size-8 sm:size-9" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h2 className="font-display text-3xl font-bold text-brand">
                  Telehealth Appointments
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Secure virtual consultations are available for eligible
                  patients in states where our providers are licensed.
                </p>
                <div className="mt-6 space-y-3 text-base">
                  <p>
                    <span className="font-medium text-brand">Available in: </span>
                    <span className="text-muted">
                      {availableStates.join(" · ")}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted">Coming soon: </span>
                    <span className="text-muted">
                      {comingSoonStates.join(" · ")}
                    </span>
                  </p>
                </div>
                <div className="mt-auto pt-8">
                  <Button asChild>
                    <Link href="/contact" data-analytics="consult_click">
                      Request a Telehealth Consultation
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
              <Image
                src="/images/Office-800x463.png"
                alt="Exterior of Health & Beauty Integrative Center"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-ink/75 px-5 py-3.5 text-xs text-ivory sm:text-sm">
                {site.name} | {site.address.line1}, {site.address.line2} |{" "}
                {site.address.city}, {site.address.state} {site.address.zip}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-2xl border border-stone">
              <iframe
                title="Map to Health & Beauty Integrative Center"
                src={site.mapsEmbed}
                className="aspect-[16/11] min-h-[240px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-6">
          <div className="flex flex-col gap-5 rounded-2xl bg-brand-light/70 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-7">
            <div className="flex items-start gap-4 sm:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                <Calendar className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-brand sm:text-4xl">
                  Ready to schedule?
                </p>
                <p className="mt-1 text-sm text-muted">
                  Request an in-person or telehealth consultation.
                </p>
              </div>
            </div>
            <Button asChild className="shrink-0 self-start sm:self-auto">
              <Link href="/contact" data-analytics="consult_click">
                Request a Consultation
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
