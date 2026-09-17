import { and, count, countDistinct, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { connection } from "next/server";

import { db } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";

export type AnalyticsRangeDays = 7 | 30 | 90;

export function parseAnalyticsRange(raw: string | undefined | null): AnalyticsRangeDays {
  if (raw === "7" || raw === "90") return Number(raw) as AnalyticsRangeDays;
  return 30;
}

async function sinceDate(days: AnalyticsRangeDays): Promise<Date> {
  // Request-time: analytics ranges must not be baked into the static prerender.
  await connection();
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - (days - 1));
  return d;
}

export type AnalyticsSummary = {
  rangeDays: AnalyticsRangeDays;
  pageViews: number;
  uniqueVisitors: number;
  consultClicks: number;
  contactSubmits: number;
  byDay: { date: string; pageViews: number; visitors: number }[];
  topPages: { path: string; views: number }[];
  usStates: { region: string; views: number }[];
  countries: { country: string; views: number }[];
  conversions: { name: string; count: number }[];
};

const CONVERSION_NAMES = [
  "consult_click",
  "phone_click",
  "portal_click",
  "chat_open",
  "contact_submit",
  "newsletter_submit",
] as const;

const CONVERSION_LABELS: Record<(typeof CONVERSION_NAMES)[number], string> = {
  consult_click: "Consult clicks",
  phone_click: "Phone clicks",
  portal_click: "Portal clicks",
  chat_open: "Chat opens",
  contact_submit: "Contact forms",
  newsletter_submit: "Newsletter signups",
};

export async function getAnalyticsSummary(
  rangeDays: AnalyticsRangeDays = 30,
): Promise<AnalyticsSummary> {
  const since = await sinceDate(rangeDays);
  const rangeFilter = gte(analyticsEvents.occurredAt, since);

  const [
    pageViewRow,
    visitorRow,
    consultRow,
    contactRow,
    byDayRows,
    visitorsByDayRows,
    topPageRows,
    usStateRows,
    countryRows,
    conversionRows,
  ] = await Promise.all([
    db
      .select({ value: count() })
      .from(analyticsEvents)
      .where(and(rangeFilter, eq(analyticsEvents.name, "page_view"))),
    db
      .select({ value: countDistinct(analyticsEvents.visitorHash) })
      .from(analyticsEvents)
      .where(and(rangeFilter, eq(analyticsEvents.name, "page_view"))),
    db
      .select({ value: count() })
      .from(analyticsEvents)
      .where(and(rangeFilter, eq(analyticsEvents.name, "consult_click"))),
    db
      .select({ value: count() })
      .from(analyticsEvents)
      .where(and(rangeFilter, eq(analyticsEvents.name, "contact_submit"))),
    db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${analyticsEvents.occurredAt} at time zone 'UTC'), 'YYYY-MM-DD')`,
        views: count(),
      })
      .from(analyticsEvents)
      .where(and(rangeFilter, eq(analyticsEvents.name, "page_view")))
      .groupBy(
        sql`date_trunc('day', ${analyticsEvents.occurredAt} at time zone 'UTC')`,
      )
      .orderBy(
        sql`date_trunc('day', ${analyticsEvents.occurredAt} at time zone 'UTC')`,
      ),
    db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${analyticsEvents.occurredAt} at time zone 'UTC'), 'YYYY-MM-DD')`,
        visitors: countDistinct(analyticsEvents.visitorHash),
      })
      .from(analyticsEvents)
      .where(and(rangeFilter, eq(analyticsEvents.name, "page_view")))
      .groupBy(
        sql`date_trunc('day', ${analyticsEvents.occurredAt} at time zone 'UTC')`,
      )
      .orderBy(
        sql`date_trunc('day', ${analyticsEvents.occurredAt} at time zone 'UTC')`,
      ),
    db
      .select({
        path: analyticsEvents.path,
        views: count(),
      })
      .from(analyticsEvents)
      .where(and(rangeFilter, eq(analyticsEvents.name, "page_view")))
      .groupBy(analyticsEvents.path)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({
        region: analyticsEvents.region,
        views: count(),
      })
      .from(analyticsEvents)
      .where(
        and(
          rangeFilter,
          eq(analyticsEvents.name, "page_view"),
          eq(analyticsEvents.country, "US"),
        ),
      )
      .groupBy(analyticsEvents.region)
      .orderBy(desc(count()))
      .limit(15),
    db
      .select({
        country: analyticsEvents.country,
        views: count(),
      })
      .from(analyticsEvents)
      .where(and(rangeFilter, eq(analyticsEvents.name, "page_view")))
      .groupBy(analyticsEvents.country)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({
        name: analyticsEvents.name,
        value: count(),
      })
      .from(analyticsEvents)
      .where(and(rangeFilter, inArray(analyticsEvents.name, [...CONVERSION_NAMES])))
      .groupBy(analyticsEvents.name),
  ]);

  const visitorsByDay = new Map(
    visitorsByDayRows.map((row) => [row.date, Number(row.visitors) || 0]),
  );

  const byDay: AnalyticsSummary["byDay"] = [];
  for (let i = 0; i < rangeDays; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    const found = byDayRows.find((row) => row.date === key);
    byDay.push({
      date: key,
      pageViews: found ? Number(found.views) || 0 : 0,
      visitors: visitorsByDay.get(key) ?? 0,
    });
  }

  const conversionMap = new Map(
    conversionRows.map((row) => [row.name, Number(row.value) || 0]),
  );

  return {
    rangeDays,
    pageViews: pageViewRow[0]?.value ?? 0,
    uniqueVisitors: visitorRow[0]?.value ?? 0,
    consultClicks: consultRow[0]?.value ?? 0,
    contactSubmits: contactRow[0]?.value ?? 0,
    byDay,
    topPages: topPageRows
      .filter((row): row is typeof row & { path: string } => Boolean(row.path))
      .map((row) => ({ path: row.path, views: Number(row.views) || 0 })),
    usStates: usStateRows
      .filter((row): row is typeof row & { region: string } => Boolean(row.region))
      .map((row) => ({ region: row.region, views: Number(row.views) || 0 })),
    countries: countryRows
      .filter((row): row is typeof row & { country: string } =>
        Boolean(row.country),
      )
      .map((row) => ({ country: row.country, views: Number(row.views) || 0 })),
    conversions: CONVERSION_NAMES.map((name) => ({
      name: CONVERSION_LABELS[name],
      count: conversionMap.get(name) ?? 0,
    })),
  };
}

export async function getAnalyticsPageViewCount(
  rangeDays: AnalyticsRangeDays = 30,
): Promise<number> {
  const since = await sinceDate(rangeDays);
  const [row] = await db
    .select({ value: count() })
    .from(analyticsEvents)
    .where(
      and(
        gte(analyticsEvents.occurredAt, since),
        eq(analyticsEvents.name, "page_view"),
      ),
    );
  return row?.value ?? 0;
}
