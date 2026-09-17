export type GeoFromHeaders = {
  country: string | null;
  region: string | null;
  city: string | null;
};

function clean(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
  return trimmed.slice(0, 80);
}

/** Read Vercel geo headers. Empty in local `next dev`. */
export function geoFromHeaders(headers: Headers): GeoFromHeaders {
  return {
    country: clean(headers.get("x-vercel-ip-country"))?.toUpperCase() ?? null,
    region: clean(headers.get("x-vercel-ip-country-region"))?.toUpperCase() ?? null,
    city: clean(headers.get("x-vercel-ip-city")),
  };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "unknown";
}
