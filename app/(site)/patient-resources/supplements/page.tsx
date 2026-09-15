import Image from "next/image";
import { Great_Vibes } from "next/font/google";
import { ExternalLink, Tag } from "lucide-react";
import type { Metadata } from "next";

import { ProductCategoryFilter } from "@/components/ProductCategoryFilter";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import {
  getPublishedRecommendedProducts,
  getPublishedSupplementBrands,
} from "@/lib/content/queries";
import { pageMetadata, pages } from "@/lib/seo";
import { supplementsPage } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata(pages.supplements);

const scriptFont = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

function LeafAccent({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      className={cn("text-brand/25", className)}
      aria-hidden
    >
      <path
        d="M58 148c2-36 18-68 46-96-28 8-52 28-66 58-8-22-8-46 2-70C22 62 18 98 28 132c6 18 18 28 30 16Z"
        fill="currentColor"
      />
      <path
        d="M60 40c-4 28-2 54 8 78"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function SupplementsPage() {
  const [brands, products] = await Promise.all([
    getPublishedSupplementBrands(),
    getPublishedRecommendedProducts(),
  ]);
  const { hero, brands: brandsCopy, products: productsCopy, info } =
    supplementsPage;

  return (
    <>
      <section className="relative isolate min-h-[70svh] overflow-hidden pt-[7.75rem]">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand-light">
              {hero.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] text-ivory text-balance sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/75 md:text-lg">
              {hero.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-stone/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand">
              {brandsCopy.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-ink md:text-4xl">
              {brandsCopy.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/80">
              {brandsCopy.body}
            </p>
          </Reveal>

          <div className="mt-12 space-y-4">
            {brands.length === 0 ? (
              <p className="text-muted">Recommendations will appear here soon.</p>
            ) : (
              brands.map((brand, index) => (
                <Reveal key={brand.id} delay={0.04 * index}>
                  <article className="flex flex-col gap-5 border border-ink/10 bg-ivory p-5 shadow-[0_12px_30px_-24px_rgba(28,27,25,0.35)] sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                    <div className="relative h-16 w-28 shrink-0 sm:h-20 sm:w-32">
                      <Image
                        src={brand.logoUrl}
                        alt={`${brand.title} logo`}
                        fill
                        className="object-contain object-left"
                        sizes="128px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-ink">
                        {brand.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {brand.description}
                      </p>
                      {brand.discountText ? (
                        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                          <Tag className="size-3.5 shrink-0" aria-hidden />
                          {brand.discountText}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="shrink-0 border-brand text-brand hover:bg-brand hover:text-white sm:self-center"
                    >
                      <a
                        href={brand.referralLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {brand.ctaLabel}
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    </Button>
                  </article>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-stone/25 py-20 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(28,27,25,0.035) 11px, rgba(28,27,25,0.035) 12px)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)]">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand">
                {productsCopy.eyebrow}
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink md:text-4xl">
                {productsCopy.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/80">
                {productsCopy.body}
              </p>
            </Reveal>
            <Reveal delay={0.08} className="relative hidden justify-self-end lg:block">
              <p
                className={cn(
                  scriptFont.className,
                  "relative z-10 text-right text-3xl leading-tight text-brand",
                )}
              >
                {productsCopy.script}
              </p>
              <LeafAccent className="absolute -bottom-8 -right-2 h-36 w-28" />
            </Reveal>
          </div>

          <ProductCategoryFilter products={products} />
        </div>
      </section>

      <section className="bg-stone/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand">
              {info.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
              {info.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/80">
              {info.body}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
