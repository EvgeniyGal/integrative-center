"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTop({
  besideChat = false,
  hidden = false,
}: {
  besideChat?: boolean;
  hidden?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = scrolled && !hidden;

  return (
    <Button
      type="button"
      size="icon"
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className={cn(
        "fixed z-40 bottom-[max(1.5rem,env(safe-area-inset-bottom))] lg:bottom-10",
        besideChat
          ? "right-[max(5rem,calc(env(safe-area-inset-right)+3.5rem))] lg:right-24"
          : "right-[max(1.5rem,env(safe-area-inset-right))] lg:right-10",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
