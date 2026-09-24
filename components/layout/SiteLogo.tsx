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
    <span className={cn("relative inline-flex items-center", className)}>
      <Image
        src="/images/logo-full.png"
        alt={site.name}
        width={2000}
        height={336}
        priority={priority}
        className={cn(
          "h-8 w-auto max-w-[min(100%,14rem)] sm:h-9 sm:max-w-[16rem] lg:h-11 lg:max-w-none",
          inverted && "brightness-0 invert",
        )}
      />
    </span>
  );
}
