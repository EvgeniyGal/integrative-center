"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { SiteLogo } from "@/components/layout/SiteLogo";
import { Ticker } from "@/components/layout/Ticker";
import { Button } from "@/components/ui/button";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

function HeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ivory/90 shadow-[0_1px_0_rgba(28,27,25,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:h-[5.5rem] lg:px-10">
        <Link href="/" className="relative flex items-center">
          <SiteLogo priority />
        </Link>
        <nav className="hidden items-center gap-8 min-[1100px]:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 min-[1100px]:flex">
          <a
            href={site.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="portal_click"
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/70 transition-colors hover:text-ink"
          >
            Patient Portal
          </a>
          <Button asChild size="sm">
            <Link href="/contact" data-analytics="consult_click">
              Request a consult
            </Link>
          </Button>
        </div>
        <span
          className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink min-[1100px]:hidden"
          aria-hidden
        >
          <Menu className="size-5" />
        </span>
      </div>
      <Ticker visible />
    </header>
  );
}

function HeaderInner() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onHero = pathname === "/" && !scrolled;
  const showTicker = pathname !== "/" || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || !onHero
          ? "bg-ivory/90 shadow-[0_1px_0_rgba(28,27,25,0.06)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:h-[5.5rem] lg:px-10">
        <Link href="/" className="relative flex items-center">
          <SiteLogo inverted={onHero} priority />
        </Link>

        <nav className="hidden items-center gap-8 min-[1100px]:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.22em] transition-colors",
                  onHero
                    ? active
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : active
                      ? "text-brand"
                      : "text-ink/70 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 min-[1100px]:flex">
          <a
            href={site.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="portal_click"
            className={cn(
              "text-[11px] font-medium uppercase tracking-[0.22em] transition-colors",
              onHero ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink",
            )}
          >
            Patient Portal
          </a>
          <Button asChild size="sm" variant={onHero ? "inverted" : "default"}>
            <Link href="/contact" data-analytics="consult_click">
              Request a consult
            </Link>
          </Button>
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex size-11 cursor-pointer items-center justify-center rounded-full border min-[1100px]:hidden",
                onHero
                  ? "border-white/30 text-white"
                  : "border-ink/15 text-ink",
              )}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,22rem)] flex-col bg-ivory p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-display text-2xl text-ink">
                  Menu
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-ink/15"
                    aria-label="Close menu"
                  >
                    <X className="size-4" />
                  </button>
                </Dialog.Close>
              </div>
              <nav className="mt-12 flex flex-col gap-6">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-display text-3xl text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <Button asChild>
                  <Link href="/contact" data-analytics="consult_click">
                    Request a consult
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={site.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics="portal_click"
                  >
                    Patient Portal
                  </a>
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <Ticker visible={showTicker} />
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderInner />
    </Suspense>
  );
}
