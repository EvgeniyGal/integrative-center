import Link from "next/link";
import { cacheLife } from "next/cache";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { footerNav, legalLinks, site } from "@/lib/site";

async function CopyrightYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

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

const linkClass =
  "text-[11px] uppercase tracking-[0.18em] text-ivory/80 transition hover:text-ivory";

export async function Footer() {
  const year = await CopyrightYear();

  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SiteLogo inverted />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/70">
              Integrative medicine in the heart of Sarasota — diagnostics,
              hormones, IV therapy, nutrition, and aesthetic care, designed
              around you.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="social_click"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition hover:border-brand hover:text-brand"
                aria-label="Instagram"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="social_click"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition hover:border-brand hover:text-brand"
                aria-label="Facebook"
              >
                <FacebookIcon className="size-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
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
              data-analytics="phone_click"
              className="mt-4 inline-block text-sm text-ivory transition hover:text-brand"
            >
              {site.phone}
            </a>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
              Menu
            </p>
            <ul className="mt-4 space-y-3">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics="portal_click"
                  className={linkClass}
                >
                  Patient Portal
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
              Legal / Information
            </p>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          <NewsletterForm footer />
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Sarasota, Florida</p>
        </div>
      </div>
    </footer>
  );
}
