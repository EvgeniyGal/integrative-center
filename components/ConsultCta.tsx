import Link from "next/link";

import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ConsultCta({
  title = "Begin with a private consultation",
  body = "Call the practice or send a note. We will listen first, then design the next step around you.",
  className,
}: {
  title?: string;
  body?: string;
  className?: string;
}) {
  return (
    <section className={cn("bg-brand text-white", className)}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-center lg:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl tracking-tight text-balance sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-white/80">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="inverted">
            <Link href="/contact">Request a consult</Link>
          </Button>
          <Button asChild variant="ghost" className="border border-white/25">
            <a href={site.phoneHref}>{site.phone}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
