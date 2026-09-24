import Link from "next/link";
import type { Metadata } from "next";

import { ArticleBlocks } from "@/components/content/ArticleBlocks";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import type { ArticleBlock } from "@/lib/content/blocks";
import { getVisiblePolicies } from "@/lib/content/queries";
import { pageMetadata, pages } from "@/lib/seo";
import { officePoliciesPage, officePolicyToc } from "@/lib/site";

export const metadata: Metadata = pageMetadata(pages.officePolicies);

export const instant = false;

function tocLabel(slug: string, title: string) {
  return (
    officePolicyToc.find((item) => item.slug === slug)?.label ?? title
  );
}

export default async function OfficePoliciesPage() {
  const policies = await getVisiblePolicies();
  const { eyebrow, title, intro } = officePoliciesPage;
  const tocPolicies = policies.filter((policy) => policy.showInToc);

  return (
    <section className="bg-ivory pt-[7.75rem]">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-12 lg:px-10 lg:pb-32 lg:pt-16">
        <Reveal>
          <Button asChild variant="outline" size="sm" className="rounded-none">
            <Link href="/patient-resources">← Back to patient resources</Link>
          </Button>
          <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.32em] text-brand">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            {intro}
          </p>
        </Reveal>

        {tocPolicies.length > 0 ? (
          <Reveal delay={0.06}>
            <nav
              aria-label="Office policies sections"
              className="mt-10 border border-brand bg-white px-4 py-4 sm:px-5"
            >
              <ul className="flex flex-wrap items-center justify-center gap-y-2 text-center text-sm leading-relaxed text-ink">
                {tocPolicies.map((policy, index) => (
                  <li key={policy.id} className="inline-flex items-center">
                    <a
                      href={`#${policy.slug}`}
                      className="px-1 text-ink/80 transition hover:text-brand"
                    >
                      {tocLabel(policy.slug, policy.title)}
                    </a>
                    {index < tocPolicies.length - 1 ? (
                      <span className="px-1.5 text-brand/50" aria-hidden>
                        |
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        ) : null}

        <div className="mt-14">
          {policies.map((policy, index) => {
            const isLast = index === policies.length - 1;
            const body = Array.isArray(policy.body)
              ? (policy.body as ArticleBlock[])
              : [];
            return (
              <Reveal key={policy.id} delay={Math.min(index * 0.02, 0.18)}>
                <article
                  id={policy.slug}
                  className={
                    isLast
                      ? "scroll-mt-28 pt-16 sm:pt-20"
                      : "scroll-mt-28 border-b border-ink/15 py-16 sm:py-20"
                  }
                >
                  <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                    {policy.title}
                  </h2>
                  <div className="mt-5">
                    <ArticleBlocks blocks={body} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
