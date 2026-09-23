import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { QuestionsCarousel } from "@/components/QuestionsCarousel";
import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import {
  getFeaturedArticles,
  getHomeServices,
  getPublishedQuestions,
  getPublishedTestimonials,
} from "@/lib/content/queries";
import { pageMetadata, pages } from "@/lib/seo";
import { homeNews, homeQuestions, practiceIntro } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.home);

export default async function HomePage() {
  const [questionRows, serviceRows, articleRows, reviewRows] =
    await Promise.all([
      getPublishedQuestions(),
      getHomeServices(),
      getFeaturedArticles(3),
      getPublishedTestimonials(),
    ]);

  const questionItems =
    questionRows.length > 0
      ? questionRows.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))
      : homeQuestions.items.map((item) => ({
          question: item.question,
          answer: item.answer,
        }));


  const serviceItems = serviceRows.map((service) => ({
    slug: service.slug,
    title: service.title,
    eyebrow: service.eyebrow,
    summary: service.summary,
    image: service.imageUrl,
  }));

  const newsItems =
    articleRows.length > 0
      ? articleRows.map((article) => ({
          slug: article.slug,
          label: article.category,
          title: article.title,
          excerpt: article.excerpt,
          image: article.coverImageUrl,
        }))
      : homeNews.items;

  const reviews = reviewRows.map((review) => ({
    title: review.title,
    quote: review.quote,
    name: review.name,
    source: review.source,
  }));

  return (
    <>
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src="/images/generated/hero.jpg"
          alt="The Health & Beauty Integrative Center interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
          <p className="text-[11px] uppercase tracking-[0.36em] text-brand-light">
            Sarasota, Florida
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.95] text-ivory text-balance sm:text-7xl lg:text-8xl">
            Greater Sarasota’s Best Health & Beauty Integrative Center
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/80 sm:text-lg">
            Located in the heart of Sarasota, Florida, Health and Beauty
            Integrative Center combines holistic health therapies with
            science-backed treatments to support the physical and mental health
            of patients of all ages. Using practical therapies, we address the
            root causes of our patients’ issues while helping to reduce their
            symptoms.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="inverted" size="lg">
              <Link href="/contact">Request a consult</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="border border-white/25">
              <Link href="/services">Explore care</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <Reveal className="lg:col-span-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
              {practiceIntro.eyebrow}
            </p>
            <h2 className="mt-4 max-w-md font-display text-4xl leading-[1.1] tracking-tight text-balance text-ink sm:text-5xl">
              {practiceIntro.title}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.08}>
            <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              {practiceIntro.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
              {homeQuestions.eyebrow}
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl uppercase leading-[1.1] tracking-tight text-balance text-ink sm:text-5xl">
              {homeQuestions.title}
            </h2>
            <div className="mt-5 space-y-1 text-xl leading-relaxed text-ink sm:text-2xl">
              {homeQuestions.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-14" delay={0.06}>
            <QuestionsCarousel items={questionItems} />
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Services"
              title="Functional and traditional medicine, held to a clinical standard."
            />
            <p className="mt-6 text-base leading-relaxed text-ivory/75 sm:text-lg">
              Explore personalized health and wellness services for women and
              men, including hormone replacement therapy, diagnostics, IV
              therapy, weight management, and nutritional support. Every care
              plan is tailored to your individual needs and health goals.
            </p>
          </Reveal>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.05}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden"
                >
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent transition duration-500 group-hover:from-ink/95 group-hover:via-ink/60" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-7">
                    <div className="translate-y-6 transition duration-500 ease-out group-hover:translate-y-0">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-brand-light">
                        {service.eyebrow}
                      </p>
                      <h3 className="mt-2 font-display text-3xl text-ivory">
                        {service.title}
                      </h3>
                      <p className="mt-0 max-h-0 overflow-hidden text-sm leading-relaxed text-ivory/80 opacity-0 transition-all duration-500 ease-out group-hover:mt-3 group-hover:max-h-40 group-hover:opacity-100">
                        {service.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone/35 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
                {homeNews.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-balance text-ink sm:text-5xl">
                {homeNews.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {homeNews.body}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-ink/25 hover:border-ink"
              >
                <Link href="/news">View all news</Link>
              </Button>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {newsItems.map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.05}>
                <article className="flex h-full flex-col">
                  <Link
                    href={`/news/${article.slug}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-brand"
                  >
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      className="object-cover transition duration-700 hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </Link>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted">
                    {article.label}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-snug tracking-tight text-ink">
                    <Link
                      href={`/news/${article.slug}`}
                      className="transition hover:text-brand"
                    >
                      {article.title}
                    </Link>
                  </h3>
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
        </div>
      </section>

      <section className="bg-stone/40 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading eyebrow="Patients" title="What people are saying" />
          </Reveal>
          <div className="mt-14">
            <TestimonialCarousel reviews={reviews} />
          </div>
        </div>
      </section>
    </>
  );
}
