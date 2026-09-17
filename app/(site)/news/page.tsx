import Image from "next/image";
import type { Metadata } from "next";

import { NewsList } from "@/components/NewsList";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
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
            <NewsList
              articles={articles.map((article) => ({
                id: article.id,
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt,
                coverImageUrl: article.coverImageUrl,
                category: article.category,
              }))}
            />
          )}
        </div>
      </section>
    </>
  );
}
