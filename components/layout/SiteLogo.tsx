import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  inverted?: boolean;
  className?: string;
  /** Kept for Header API compatibility; unused with CSS mask. */
  priority?: boolean;
};

export function SiteLogo({
  inverted = false,
  className,
}: SiteLogoProps) {
  return (
    <span
      role="img"
      aria-label={site.name}
      className={cn(
        "inline-block h-8 w-[11.9rem] shrink-0 sm:h-9 sm:w-[13.4rem] lg:h-11 lg:w-[16.4rem]",
        inverted ? "bg-ivory" : "bg-brand",
        className,
      )}
      style={{
        maskImage: "url(/images/logo-full.png)",
        WebkitMaskImage: "url(/images/logo-full.png)",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "left center",
        WebkitMaskPosition: "left center",
        maskMode: "alpha",
      }}
    />
  );
}
