import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { ConsultCta } from "@/components/ConsultCta";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { getPublishedArticles } from "@/lib/content/queries";
import { pageMetadata, pages } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(pages.news);

export default async function NewsPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <section className="relative isolate min-h-[70svh] overflow-hidden pt-[7.75rem]">
        <Image
          src="/images/generated/exterior.jpg"
          alt="News and updates from the practice"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
              News
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ivory text-balance sm:text-7xl">
              Updates from the practice.
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              title="Practice news and seasonal notes."
              body="Clinic updates, wellness insights, and announcements from Health & Beauty Integrative Center."
            />
          </Reveal>

          {articles.length === 0 ? (
            <Reveal delay={0.1}>
              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
                New stories are on the way. Follow us on Instagram and Facebook
                for the latest from the team in Sarasota.
              </p>
            </Reveal>
          ) : (
            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <Reveal key={article.id} delay={i * 0.05}>
                  <article className="flex h-full flex-col">
                    <Link
                      href={`/news/${article.slug}`}
                      className="relative block aspect-[4/3] overflow-hidden bg-brand"
                    >
                      <Image
                        src={article.coverImageUrl}
                        alt=""
                        fill
                        className="object-cover transition duration-700 hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, 50vw, 100vw"
                      />
                    </Link>
                    <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted">
                      {article.category}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-snug tracking-tight text-ink">
                      <Link
                        href={`/news/${article.slug}`}
                        className="transition hover:text-brand"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {article.excerpt}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-6 w-fit rounded-none border-ink/25 hover:border-ink"
                    >
                      <Link href={`/news/${article.slug}`}>Read more</Link>
                    </Button>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <ConsultCta
        title="Ready to start a conversation?"
        body="Request a consult and tell us what you would like to address."
      />
    </>
  );
}
