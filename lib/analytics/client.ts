import type { AnalyticsEventName } from "@/lib/analytics/events";

export type ClientAnalyticsPayload = {
  name: AnalyticsEventName;
  path?: string | null;
  device?: "mobile" | "desktop" | "tablet" | null;
  referrerHost?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  meta?: Record<string, string> | null;
};

function detectDevice(): "mobile" | "desktop" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|iphone|android/.test(ua)) return "mobile";
  return "desktop";
}

function utmFromSearch(): {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
} {
  if (typeof window === "undefined") {
    return { utmSource: null, utmMedium: null, utmCampaign: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };
}

function referrerHost(): string | null {
  if (typeof document === "undefined" || !document.referrer) return null;
  try {
    return new URL(document.referrer).hostname;
  } catch {
    return null;
  }
}

/** Fire-and-forget client event. Prefer sendBeacon; fall back to fetch keepalive. */
export function trackClientEvent(
  name: AnalyticsEventName,
  extras?: Partial<Omit<ClientAnalyticsPayload, "name">>,
): void {
  if (typeof window === "undefined") return;

  const utm = utmFromSearch();
  const payload: ClientAnalyticsPayload = {
    name,
    path: extras?.path ?? window.location.pathname,
    device: extras?.device ?? detectDevice(),
    referrerHost: extras?.referrerHost ?? referrerHost(),
    utmSource: extras?.utmSource ?? utm.utmSource,
    utmMedium: extras?.utmMedium ?? utm.utmMedium,
    utmCampaign: extras?.utmCampaign ?? utm.utmCampaign,
    meta: extras?.meta ?? null,
  };

  const body = JSON.stringify(payload);
  try {
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/analytics", blob)) return;
    }
  } catch {
    // fall through to fetch
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Ignore network errors — analytics must never break the site.
  });
}
