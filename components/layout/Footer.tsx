import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { nav, site } from "@/lib/site";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.2h2.4l.36-2.8h-2.76V9.2c0-.8.22-1.36 1.38-1.36H16.5V5.32c-.24-.04-.96-.1-1.84-.1-1.82 0-3.06 1.1-3.06 3.14v1.64H9v2.8h2.6V21h1.9Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Image
              src="/images/logo-transparent.png"
              alt={site.name}
              width={240}
              height={40}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/65">
              Integrative medicine in the heart of Sarasota — diagnostics,
              hormones, IV therapy, nutrition, and aesthetic care, designed
              around you.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition hover:border-brand hover:text-brand"
                aria-label="Instagram"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition hover:border-brand hover:text-brand"
                aria-label="Facebook"
              >
                <FacebookIcon className="size-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
              Visit
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/80">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </p>
            <a
              href={site.phoneHref}
              className="mt-4 inline-block text-sm text-ivory hover:text-brand"
            >
              {site.phone}
            </a>
            <p className="mt-3 text-xs text-ivory/50">
              {site.hours.summary}
              <br />
              {site.hours.note}
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
              Menu
            </p>
            <ul className="mt-4 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ivory/75 transition hover:text-ivory"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ivory/75 transition hover:text-ivory"
                >
                  Patient Portal
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
              Insider
            </p>
            <p className="mt-4 text-sm text-ivory/65">
              Exclusive specials, events, and news.
            </p>
            <div className="mt-4">
              <NewsletterForm compact />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Sarasota, Florida</p>
        </div>
      </div>
    </footer>
  );
}
