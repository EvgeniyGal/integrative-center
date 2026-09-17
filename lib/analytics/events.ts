export const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "consult_click",
  "phone_click",
  "portal_click",
  "contact_submit",
  "newsletter_submit",
  "chat_open",
  "chat_message",
  "outbound_click",
  "maps_click",
  "social_click",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export const ANALYTICS_DEVICES = ["mobile", "desktop", "tablet"] as const;

export type AnalyticsDevice = (typeof ANALYTICS_DEVICES)[number];

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return (ANALYTICS_EVENT_NAMES as readonly string[]).includes(value);
}

export function isAnalyticsDevice(value: string): value is AnalyticsDevice {
  return (ANALYTICS_DEVICES as readonly string[]).includes(value);
}
