import Image from "next/image";
import type { Metadata } from "next";

import { PatientFormsList } from "@/components/content/PatientFormsList";
import { Reveal } from "@/components/motion/Reveal";
import { getPublishedPatientForms } from "@/lib/content/queries";
import type { DocumentBlockItem } from "@/lib/content/blocks";
import { pageMetadata, pages } from "@/lib/seo";
import { patientFormsPage } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.patientForms);

export default async function PatientFormsPage() {
  const forms = await getPublishedPatientForms();
  const { hero, empty } = patientFormsPage;

  const items: DocumentBlockItem[] = forms.map((form) => ({
    title: form.title,
    description: form.description,
    url: form.pdfUrl,
    fileName: form.pdfFileName,
  }));

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

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {items.length > 0 ? (
            <PatientFormsList items={items} />
          ) : (
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                {empty.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                {empty.body}
              </p>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
