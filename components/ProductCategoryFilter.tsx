"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import type { RecommendedProduct } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export function ProductCategoryFilter({
  products,
}: {
  products: RecommendedProduct[];
}) {
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean)),
    );
    return unique;
  }, [products]);

  const [active, setActive] = useState("All Products");

  const filtered = useMemo(() => {
    if (active === "All Products") return products;
    return products.filter((product) => product.category === active);
  }, [active, products]);

  return (
    <div className="mt-10 space-y-10">
      <div className="flex flex-wrap gap-2">
        {["All Products", ...categories].map((category) => {
          const isActive = active === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-ink/15 bg-ivory text-ink hover:border-brand/40",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">No products in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <Reveal key={product.id} delay={0.04 * index}>
              <article className="flex h-full flex-col border border-ink/10 bg-ivory p-5 shadow-[0_12px_30px_-24px_rgba(28,27,25,0.35)]">
                <div className="relative mx-auto aspect-square w-full max-w-[11rem]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="176px"
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">
                  {product.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {product.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-5 w-full border-brand text-brand hover:bg-brand hover:text-white"
                >
                  <a
                    href={product.referralLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{product.ctaLabel}</span>
                    {product.storeLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.storeLogoUrl}
                        alt=""
                        className="h-4 w-auto"
                      />
                    ) : null}
                  </a>
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
