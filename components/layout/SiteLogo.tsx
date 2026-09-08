import Image from "next/image";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  inverted?: boolean;
  className?: string;
  priority?: boolean;
};

export function SiteLogo({
  inverted = false,
  className,
  priority = false,
}: SiteLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        inverted ? "text-ivory" : "text-brand",
        className,
      )}
    >
      <Image
        src="/images/icon.svg"
        alt=""
        width={80}
        height={80}
        priority={priority}
        unoptimized
        className={cn(
          "h-8 w-8 shrink-0 lg:h-10 lg:w-10",
          inverted && "brightness-0 invert",
        )}
      />
      <span className="hidden min-w-0 flex-col justify-center min-[1300px]:flex">
        <span className="font-display text-[0.95rem] font-semibold uppercase leading-none tracking-[0.04em] lg:text-[1.15rem]">
          Health & Beauty
        </span>
        <span
          className={cn(
            "mt-[0.28em] h-px w-full",
            inverted ? "bg-ivory/85" : "bg-brand",
          )}
          aria-hidden
        />
        <span className="mt-[0.32em] text-[0.48rem] font-medium uppercase leading-none tracking-[0.28em] lg:text-[0.58rem] lg:tracking-[0.32em]">
          Integrative Center
        </span>
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
