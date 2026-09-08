import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArticleBlocks } from "@/components/content/ArticleBlocks";
import { ConsultCta } from "@/components/ConsultCta";
import { Button } from "@/components/ui/button";
import { getArticleBySlug, getPublishedArticles } from "@/lib/content/queries";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  try {
    const articles = await getPublishedArticles();
    return articles.map((article) => ({ slug: article.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title,
      description,
      url: `${site.url}/news/${article.slug}`,
      siteName: site.name,
      type: "article",
      images: [{ url: article.coverImageUrl }],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <section className="relative isolate min-h-[60svh] overflow-hidden pt-[7.75rem]">
        <Image
          src={article.coverImageUrl}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto flex min-h-[60svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
              {article.category}
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ivory text-balance sm:text-6xl">
              {article.title}
            </h1>
            {article.publishedAt ? (
              <p className="mt-4 text-sm text-ivory/70">
                {article.publishedAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="max-w-3xl text-lg leading-relaxed text-muted">
            {article.excerpt}
          </p>
          <div className="mt-14">
            <ArticleBlocks blocks={article.blocks ?? []} />
          </div>
          <Button asChild variant="outline" className="mt-14">
            <Link href="/news">Back to news</Link>
          </Button>
        </div>
      </section>

      <ConsultCta
        title="Questions about this topic?"
        body="Request a consult and we can talk through what applies to you."
      />
    </>
  );
}
