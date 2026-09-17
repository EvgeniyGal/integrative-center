import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, getVisibleServices } from "@/lib/content/queries";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const rows = await getVisibleServices();
  return rows.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} | ${site.shortName}`,
    description: service.summary,
    openGraph: {
      title: service.title,
      description: service.summary,
      images: service.imageUrl ? [{ url: service.imageUrl }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const body = service.body ?? [];

  return (
    <>
      <section className="relative isolate min-h-[60svh] overflow-hidden pt-[7.75rem]">
        <Image
          src={service.imageUrl}
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
              {service.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ivory text-balance sm:text-7xl">
              {service.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">
              {service.summary}
            </p>
          </Reveal>
          {body.length > 0 ? (
            <Reveal className="mt-10 space-y-5 text-base leading-relaxed text-muted sm:text-lg" delay={0.08}>
              {body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </Reveal>
          ) : null}
          <Reveal className="mt-12 flex flex-wrap gap-3" delay={0.12}>
            <Button asChild>
              <Link href="/contact" data-analytics="consult_click">
                Request a consult
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">All services</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
