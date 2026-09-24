import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { ListingBreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { getVisibleServices } from "@/lib/content/queries";
import { serviceBodyPlainText } from "@/lib/content/service-body";
import { contentImageAlt, pageMetadata, pages } from "@/lib/seo";
import { servicesIntro } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.services);

/** First 2–3 body sentences, ending with … to show more follows. */
function serviceCardExcerpt(body: unknown, fallback: string) {
  const source = serviceBodyPlainText(body);
  const text = (source || fallback).trim();
  if (!text) return "";

  const sentences =
    text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)?.map((s) => s.trim()) ?? [
      text,
    ];

  let count = Math.min(2, sentences.length);
  if (sentences.length >= 3 && sentences.slice(0, 2).join(" ").length < 180) {
    count = 3;
  }

  const excerpt = sentences.slice(0, count).join(" ").trim();
  return `${excerpt.replace(/[.…]+$/, "")}…`;
}

export default async function ServicesPage() {
  const wellnessServices = await getVisibleServices();

  return (
    <>
      <ListingBreadcrumbJsonLd name="Services" path="/services" />
      <section className="relative isolate min-h-[70svh] overflow-hidden pt-[7.75rem]">
        <Image
          src="/images/generated/reception.jpg"
          alt="A private consult setting"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
              Services
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ivory text-balance sm:text-7xl">
              Care tailored to the person in front of us.
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <Reveal className="lg:col-span-5">
            <SectionHeading title={servicesIntro.title} />
          </Reveal>
          <Reveal
            className="space-y-6 text-base leading-relaxed text-muted sm:text-lg lg:col-span-7"
            delay={0.08}
          >
            {servicesIntro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {wellnessServices.map((service, index) => {
        const imageRight = index % 2 === 1;
        const excerpt = serviceCardExcerpt(service.body, service.summary);
        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`scroll-mt-36 ${
              index % 2 === 0 ? "bg-stone/30" : "bg-ivory"
            }`}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-12 lg:gap-14 lg:px-10 lg:py-24">
              <Reveal
                className={
                  imageRight
                    ? "relative aspect-[4/3] overflow-hidden lg:col-span-6 lg:order-2"
                    : "relative aspect-[4/3] overflow-hidden lg:col-span-6"
                }
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="absolute inset-0 block transition duration-500 hover:opacity-90"
                  aria-label={`Read more about ${service.title}`}
                >
                  <Image
                    src={service.imageUrl}
                    alt={contentImageAlt(service.title)}
                    fill
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </Link>
              </Reveal>
              <Reveal
                className={
                  imageRight ? "lg:col-span-6 lg:order-1" : "lg:col-span-6"
                }
                delay={0.08}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand">
                  {service.eyebrow}
                </p>
                <h2 className="mt-4 font-display text-4xl tracking-tight text-ink sm:text-5xl">
                  <Link
                    href={`/services/${service.slug}`}
                    className="transition-colors hover:text-brand"
                  >
                    {service.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                  {excerpt}
                </p>
                <Button asChild className="mt-8">
                  <Link href={`/services/${service.slug}`}>Read more</Link>
                </Button>
              </Reveal>
            </div>
          </section>
        );
      })}
    </>
  );
}
