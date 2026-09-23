"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 9;

export type NewsListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  category: string;
};

export function NewsList({ articles }: { articles: NewsListItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <>
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article, i) => (
          <Reveal key={article.id} delay={(i % PAGE_SIZE) * 0.05}>
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
                className="mt-6 w-fit bg-white hover:bg-brand-light/40"
              >
                <Link href={`/news/${article.slug}`}>Read more</Link>
              </Button>
            </article>
          </Reveal>
        ))}
      </div>
      {hasMore ? (
        <div className="mt-14 flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="bg-white hover:bg-brand-light/40"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Load more
          </Button>
        </div>
      ) : null}
    </>
  );
}
