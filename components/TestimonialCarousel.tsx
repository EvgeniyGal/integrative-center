"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

export type ReviewItem = {
  title: string;
  quote: string;
  name: string;
  source: string;
};

export function TestimonialCarousel({
  reviews,
  light = false,
}: {
  reviews: ReviewItem[];
  light?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [
      Autoplay({
        delay: 20_000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {reviews.map((review) => (
            <figure
              key={`${review.name}-${review.title}`}
              className="min-w-0 shrink-0 grow-0 basis-full pr-8 md:basis-1/2 lg:basis-1/3"
            >
              <p
                className={cn(
                  "text-[11px] uppercase tracking-[0.28em]",
                  light ? "text-brand-light" : "text-brand",
                )}
              >
                {review.title}
              </p>
              <blockquote
                className={cn(
                  "mt-5 font-display text-2xl leading-snug text-balance",
                  light ? "text-ivory" : "text-ink",
                )}
              >
                “{review.quote}”
              </blockquote>
              <figcaption
                className={cn(
                  "mt-6 text-sm",
                  light ? "text-ivory/60" : "text-muted",
                )}
              >
                {review.name}
                <span className="mx-2 opacity-40">·</span>
                {review.source}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10 flex gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous review"
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full border transition",
            light
              ? "border-white/20 text-ivory hover:bg-white/10"
              : "border-ink/15 text-ink hover:border-brand hover:text-brand",
          )}
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next review"
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full border transition",
            light
              ? "border-white/20 text-ivory hover:bg-white/10"
              : "border-ink/15 text-ink hover:border-brand hover:text-brand",
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
