"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AnalyticsSummary } from "@/lib/analytics/queries";
import { cn } from "@/lib/utils";

const BRAND = "#079ca2";
const BRAND_DARK = "#05747a";
const INK = "#1c1b19";
const MUTED = "#6d6861";
const STONE = "#e4ddd2";
const HIGHLIGHT_STATES = new Set(["FL", "MA", "IL", "NJ"]);

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
] as const;

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-ink/10 bg-ivory p-5", className)}>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function EmptyNote({ message }: { message: string }) {
  return (
    <p className="flex h-48 items-center justify-center text-sm text-muted">
      {message}
    </p>
  );
}

function formatDayLabel(iso: string) {
  const [, month, day] = iso.split("-");
  return `${month}/${day}`;
}

export function AnalyticsDashboard({ data }: { data: AnalyticsSummary }) {
  const hasTraffic = data.pageViews > 0;
  const hasConversions = data.conversions.some((row) => row.count > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-2xl text-sm text-muted">
          First-party, cookieless analytics. Country and US state come from
          Vercel geo headers on production requests — they stay empty in local
          development.
        </p>
        <div className="flex flex-wrap gap-2">
          {RANGES.map((range) => (
            <Link
              key={range.days}
              href={`/admin/analytics?range=${range.days}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition",
                data.rangeDays === range.days
                  ? "border-brand bg-brand text-white"
                  : "border-ink/15 text-ink hover:border-brand/40",
              )}
            >
              {range.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Page views", value: data.pageViews },
          { label: "Unique visitors", value: data.uniqueVisitors },
          { label: "Consult clicks", value: data.consultClicks },
          { label: "Contact forms", value: data.contactSubmits },
        ].map((kpi) => (
          <div key={kpi.label} className="border border-ink/10 bg-ivory p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
              {kpi.label}
            </p>
            <p className="mt-3 font-display text-4xl text-ink">{kpi.value}</p>
          </div>
        ))}
      </div>

      {!hasTraffic && !hasConversions ? (
        <div className="border border-dashed border-ink/15 bg-ivory/60 px-6 py-14 text-center">
          <p className="font-display text-2xl text-ink">No analytics yet</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Browse the public site to start collecting page views. Conversion
            events fire when visitors click consult, call, portal, chat, or
            submit forms.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Traffic by day" className="lg:col-span-2">
          {hasTraffic ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.byDay}>
                  <defs>
                    <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={BRAND} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={STONE} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDayLabel}
                    tick={{ fill: MUTED, fontSize: 11 }}
                    minTickGap={24}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: MUTED, fontSize: 11 }}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      border: `1px solid ${STONE}`,
                      borderRadius: 0,
                      background: "#f6f3ee",
                    }}
                    labelFormatter={(label) => String(label)}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    name="Page views"
                    stroke={BRAND}
                    fill="url(#viewsFill)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke={BRAND_DARK}
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyNote message="No page views in this range." />
          )}
        </ChartCard>

        <ChartCard title="Top pages">
          {data.topPages.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topPages}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid stroke={STONE} strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: MUTED, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="path"
                    width={110}
                    tick={{ fill: INK, fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      border: `1px solid ${STONE}`,
                      background: "#f6f3ee",
                    }}
                  />
                  <Bar dataKey="views" name="Views" fill={BRAND} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyNote message="No page data yet." />
          )}
        </ChartCard>

        <ChartCard title="Conversions">
          {hasConversions ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.conversions}>
                  <CartesianGrid stroke={STONE} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: MUTED, fontSize: 10 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: MUTED, fontSize: 11 }} width={32} />
                  <Tooltip
                    contentStyle={{
                      border: `1px solid ${STONE}`,
                      background: "#f6f3ee",
                    }}
                  />
                  <Bar dataKey="count" name="Count" fill={BRAND_DARK} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyNote message="No conversion events yet." />
          )}
        </ChartCard>

        <ChartCard title="US states">
          {data.usStates.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.usStates}>
                  <CartesianGrid stroke={STONE} strokeDasharray="3 3" />
                  <XAxis dataKey="region" tick={{ fill: MUTED, fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: MUTED, fontSize: 11 }} width={32} />
                  <Tooltip
                    contentStyle={{
                      border: `1px solid ${STONE}`,
                      background: "#f6f3ee",
                    }}
                  />
                  <Bar dataKey="views" name="Views" radius={[4, 4, 0, 0]}>
                    {data.usStates.map((entry) => (
                      <Cell
                        key={entry.region}
                        fill={
                          HIGHLIGHT_STATES.has(entry.region) ? BRAND : BRAND_DARK
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyNote message="US state data appears after production traffic." />
          )}
        </ChartCard>

        <ChartCard title="Countries">
          {data.countries.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.countries}
                    dataKey="views"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={(props) => {
                      const country = (props as { country?: string }).country;
                      return country ?? "";
                    }}
                  >
                    {data.countries.map((entry, index) => (
                      <Cell
                        key={entry.country}
                        fill={index === 0 ? BRAND : index % 2 === 0 ? BRAND_DARK : "#9bc9cc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      border: `1px solid ${STONE}`,
                      background: "#f6f3ee",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyNote message="Country data appears after production traffic." />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
