"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

export type QuestionItem = {
  question: string;
  answer: string;
};

export function QuestionsCarousel({ items }: { items: QuestionItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: items.length > 1,
      align: "start",
      skipSnaps: false,
    },
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

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {items.map((item) => (
            <div
              key={item.question}
              className="min-w-0 shrink-0 grow-0 basis-[85%] pr-4 sm:basis-1/2 sm:pr-5 lg:basis-1/3"
            >
              <div className="flex h-full min-h-[220px] flex-col border border-ink/20 bg-ivory/40 p-6 lg:p-7">
                <h3 className="font-display text-2xl tracking-tight text-ink">
                  {item.question}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {items.length > 1 ? (
        <div className="mt-10 flex gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous question"
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-brand hover:text-brand"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next question"
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-brand hover:text-brand"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
