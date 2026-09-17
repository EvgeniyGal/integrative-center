import { headers } from "next/headers";

import {
  isAnalyticsDevice,
  isAnalyticsEventName,
  type AnalyticsDevice,
  type AnalyticsEventName,
} from "@/lib/analytics/events";
import { geoFromHeaders, getClientIp } from "@/lib/analytics/geo";
import { dailyVisitorHash } from "@/lib/analytics/visitor";
import { db } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";
import { site } from "@/lib/site";

const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|wget|curl|python-requests|scrapy/i;

export type IngestAnalyticsInput = {
  name: AnalyticsEventName;
  path?: string | null;
  device?: string | null;
  referrerHost?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  meta?: Record<string, string> | null;
  /** When provided (API route), use these; otherwise read from next/headers. */
  requestHeaders?: Headers;
  userAgent?: string | null;
};

function stripPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const url = new URL(raw);
      return (url.pathname || "/").slice(0, 500);
    }
  } catch {
    // fall through
  }
  const pathOnly = raw.split("?")[0]?.split("#")[0] ?? raw;
  if (!pathOnly.startsWith("/")) return null;
  if (pathOnly.startsWith("/admin") || pathOnly.startsWith("/api")) return null;
  return pathOnly.slice(0, 500);
}

function cleanHost(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const host = raw.includes("://")
      ? new URL(raw).hostname
      : raw.replace(/^\/\//, "").split("/")[0];
    if (!host) return null;
    const siteHost = new URL(site.url).hostname;
    if (host === siteHost || host === "localhost" || host === "127.0.0.1") {
      return null;
    }
    return host.slice(0, 200);
  } catch {
    return null;
  }
}

function cleanUtm(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().slice(0, 120);
  return trimmed || null;
}

function cleanMeta(
  meta: Record<string, string> | null | undefined,
): Record<string, string> {
  if (!meta || typeof meta !== "object") return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (typeof key !== "string" || typeof value !== "string") continue;
    const k = key.trim().slice(0, 40);
    const v = value.trim().slice(0, 200);
    if (!k || !v) continue;
    // Never store emails / phones / free text that looks like PII
    if (/@/.test(v) || /^\+?\d[\d\s()-]{6,}$/.test(v)) continue;
    out[k] = v;
    if (Object.keys(out).length >= 8) break;
  }
  return out;
}

function resolveDevice(
  device: string | null | undefined,
  userAgent: string | null | undefined,
): AnalyticsDevice | null {
  if (device && isAnalyticsDevice(device)) return device;
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|iphone|android/.test(ua)) return "mobile";
  return "desktop";
}

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_RE.test(userAgent);
}

/**
 * Insert one analytics event. Safe to call from API routes and server actions.
 * Never throws to callers for expected failures — returns false instead.
 */
export async function ingestAnalyticsEvent(
  input: IngestAnalyticsInput,
): Promise<boolean> {
  try {
    if (!isAnalyticsEventName(input.name)) return false;

    const headerList = input.requestHeaders ?? (await headers());
    const userAgent =
      input.userAgent ?? headerList.get("user-agent") ?? undefined;

    if (isBotUserAgent(userAgent)) return false;

    const path = stripPath(input.path);
    if (input.name === "page_view" && !path) return false;
    if (path?.startsWith("/admin") || path?.startsWith("/api")) return false;

    const geo = geoFromHeaders(headerList);
    const ip = getClientIp(headerList);
    const secret = process.env.AUTH_SECRET ?? "";
    const visitorHash = dailyVisitorHash(ip, secret);
    const device = resolveDevice(input.device, userAgent);

    await db.insert(analyticsEvents).values({
      name: input.name,
      path,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      device,
      referrerHost: cleanHost(input.referrerHost),
      utmSource: cleanUtm(input.utmSource),
      utmMedium: cleanUtm(input.utmMedium),
      utmCampaign: cleanUtm(input.utmCampaign),
      visitorHash,
      meta: cleanMeta(input.meta),
    });

    return true;
  } catch (error) {
    console.error("Analytics ingest failed", error);
    return false;
  }
}
