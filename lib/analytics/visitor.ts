import { createHmac } from "crypto";

/** Daily visitor hash — rotates at UTC midnight; never stored as raw IP. */
export function dailyVisitorHash(ip: string, secret: string): string | null {
  if (!ip || ip === "unknown" || !secret) return null;
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", secret).update(`${ip}:${day}`).digest("hex").slice(0, 32);
}
