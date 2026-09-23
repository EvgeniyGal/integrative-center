"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import type { AnalyticsEventName } from "@/lib/analytics/events";
import { trackClientEvent } from "@/lib/analytics/client";
import { site } from "@/lib/site";

function hostFromHref(href: string): string | null {
  try {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return new URL(href).hostname;
    }
  } catch {
    return null;
  }
  return null;
}

function classifyClick(anchor: HTMLAnchorElement): {
  name: AnalyticsEventName;
  meta?: Record<string, string>;
} | null {
  const explicit = anchor.getAttribute("data-analytics");
  if (explicit) {
    const name = explicit as AnalyticsEventName;
    const dest = hostFromHref(anchor.href);
    return {
      name,
      meta: dest ? { destination: dest } : undefined,
    };
  }

  const href = anchor.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) {
    return { name: "phone_click" };
  }

  if (href.includes("charmtracker.com") || href === site.portalUrl) {
    return { name: "portal_click" };
  }

  if (
    href === site.mapsLink ||
    href.includes("google.com/maps") ||
    href.includes("maps.google")
  ) {
    return { name: "maps_click" };
  }

  if (
    href === site.social.instagram ||
    href === site.social.facebook ||
    href.includes("instagram.com") ||
    href.includes("facebook.com")
  ) {
    const dest = hostFromHref(href) ?? "social";
    return { name: "social_click", meta: { destination: dest } };
  }

  // Internal consult CTAs that link to /contact without data-analytics
  if (
    (href === "/contact" || href.endsWith("/contact")) &&
    /consult|request/i.test(anchor.textContent ?? "")
  ) {
    return { name: "consult_click" };
  }

  return null;
}

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackClientEvent("page_view", { path: pathname });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

      const classified = classifyClick(anchor);
      if (!classified) return;

      // Outbound product/brand links marked explicitly
      if (
        classified.name === "outbound_click" ||
        anchor.hasAttribute("data-analytics-outbound")
      ) {
        const dest = hostFromHref(anchor.href);
        trackClientEvent("outbound_click", {
          meta: {
            ...(classified.meta ?? {}),
            ...(dest ? { destination: dest } : {}),
          },
        });
        return;
      }

      trackClientEvent(classified.name, {
        meta: classified.meta,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
}
