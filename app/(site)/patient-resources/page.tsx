import Image from "next/image";
import type { Metadata } from "next";

import { ConsultCta } from "@/components/ConsultCta";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { pageMetadata, pages } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.patientResources);

export default function PatientResourcesPage() {
  return (
    <>
      <section className="relative isolate min-h-[70svh] overflow-hidden pt-[7.75rem]">
        <Image
          src="/images/generated/about.jpg"
          alt="Patient resources at the practice"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 pb-16 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-brand-light">
              Patient resources
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ivory text-balance sm:text-7xl">
              Guidance for every step of your care.
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              title="Forms, portal access, and visit prep."
              body="Use these resources to prepare for appointments, review practice information, and manage your care online."
            />
          </Reveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
                Online access
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
                Patient portal
              </h2>
              <p className="mt-4 max-w-md text-muted leading-relaxed">
                View records, messages, and appointment details through our
                secure patient portal.
              </p>
              <Button asChild className="mt-8">
                <a
                  href={site.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open patient portal
                </a>
              </Button>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-[11px] uppercase tracking-[0.28em] text-brand">
                Before your visit
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
                What to expect
              </h2>
              <p className="mt-4 max-w-md text-muted leading-relaxed">
                Bring a list of current medications and supplements, recent lab
                results if you have them, and any questions you want to cover
                during your consult.
              </p>
              <p className="mt-4 max-w-md text-muted leading-relaxed">
                New patients: please arrive a few minutes early so we can
                complete intake paperwork before your appointment.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ConsultCta
        title="Have a question before your visit?"
        body="Reach out and our team will help you prepare for your consult."
      />
    </>
  );
}
