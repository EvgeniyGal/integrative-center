import { z } from "zod";

import { ANALYTICS_EVENT_NAMES, isAnalyticsEventName } from "@/lib/analytics/events";
import { getClientIp } from "@/lib/analytics/geo";
import { ingestAnalyticsEvent, isBotUserAgent } from "@/lib/analytics/ingest";
import { takeAnalyticsRateLimit } from "@/lib/analytics/rate-limit";

export const maxDuration = 10;

const bodySchema = z.object({
  name: z.string().min(1).max(40),
  path: z.string().max(500).optional().nullable(),
  device: z.enum(["mobile", "desktop", "tablet"]).optional().nullable(),
  referrerHost: z.string().max(200).optional().nullable(),
  utmSource: z.string().max(120).optional().nullable(),
  utmMedium: z.string().max(120).optional().nullable(),
  utmCampaign: z.string().max(120).optional().nullable(),
  meta: z.record(z.string(), z.string().max(200)).optional().nullable(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  if (!takeAnalyticsRateLimit(ip)) {
    return Response.json({ ok: false }, { status: 429 });
  }

  const userAgent = request.headers.get("user-agent");
  if (isBotUserAgent(userAgent)) {
    return Response.json({ ok: true });
  }

  let json: unknown;
  try {
    const text = await request.text();
    if (text.length > 8_000) {
      return Response.json({ ok: false }, { status: 413 });
    }
    json = JSON.parse(text);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!isAnalyticsEventName(parsed.data.name)) {
    return Response.json(
      { ok: false, allowed: ANALYTICS_EVENT_NAMES },
      { status: 400 },
    );
  }

  // Client must not send geo — server owns location from Vercel headers.
  await ingestAnalyticsEvent({
    name: parsed.data.name,
    path: parsed.data.path,
    device: parsed.data.device,
    referrerHost: parsed.data.referrerHost,
    utmSource: parsed.data.utmSource,
    utmMedium: parsed.data.utmMedium,
    utmCampaign: parsed.data.utmCampaign,
    meta: parsed.data.meta,
    requestHeaders: request.headers,
    userAgent,
  });

  return Response.json({ ok: true });
}
