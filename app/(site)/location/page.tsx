import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.location);

export default function LocationPage() {
  return (
    <section className="relative overflow-hidden bg-ivory pt-[7.75rem] pb-24 lg:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
            Location
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
            Find us in Sarasota.
          </h1>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-stone bg-white p-8 shadow-[0_12px_40px_-28px_rgba(28,27,25,0.35)] lg:p-10">
              <div className="flex size-11 items-center justify-center rounded-full bg-brand-light text-brand">
                <MapPin className="size-5" aria-hidden />
              </div>
              <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-brand">
                The practice
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink">{site.name}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                We welcome patients by appointment at our suite on Tamiami
                Trail.
              </p>

              <ul className="mt-8 space-y-5 text-sm text-muted">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                  <a
                    href={site.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics="maps_click"
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
                  <a
                    href={site.phoneHref}
                    data-analytics="phone_click"
                    className="hover:text-ink"
                  >
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-brand" />
                  <div>
                    <p>{site.hours.summary}</p>
                    <p className="mt-1">{site.hours.note}</p>
                    <ul className="mt-4 space-y-1">
                      {site.hours.days.map((item) => (
                        <li key={item.day}>
                          <span className="text-ink">{item.day}:</span>{" "}
                          {item.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>

              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <Button asChild>
                  <a href={site.phoneHref} data-analytics="phone_click">
                    Call the front desk
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact" data-analytics="consult_click">
                    Request a consult
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-stone bg-white p-8 shadow-[0_12px_40px_-28px_rgba(28,27,25,0.35)] lg:p-10">
              <div className="flex size-11 items-center justify-center rounded-full bg-brand-light text-brand">
                <MapPin className="size-5" aria-hidden />
              </div>
              <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-brand">
                Directions
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink">
                Open the map for turn-by-turn guidance.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Suite 151 is on S Tamiami Trail. Appointments are recommended so
                we can prepare for your visit.
              </p>
              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:flex-wrap">
                <Button asChild>
                  <a
                    href={site.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics="maps_click"
                  >
                    Open in Google Maps
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

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/generated/exterior.jpg"
                alt="Exterior of Health & Beauty Integrative Center"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-ink/70 px-5 py-4 text-sm text-ivory">
                <p className="font-medium">{site.name}</p>
                <p className="mt-1 text-ivory/80">{site.address.full}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-2xl border border-stone">
              <iframe
                title="Map to Health & Beauty Integrative Center"
                src={site.mapsEmbed}
                className="h-full min-h-[280px] w-full aspect-[4/3] grayscale lg:min-h-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-6">
          <div className="flex flex-col gap-6 rounded-2xl bg-brand-light/60 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-start gap-4 sm:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
                <Calendar className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-display text-2xl text-ink">
                  Appointments recommended
                </p>
                <p className="mt-1 text-sm text-muted">
                  We welcome patients by appointment at our suite on Tamiami
                  Trail.
                </p>
              </div>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/contact" data-analytics="consult_click">
                Request a consult
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
