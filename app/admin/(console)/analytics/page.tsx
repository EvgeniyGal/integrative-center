import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import {
  getAnalyticsSummary,
  parseAnalyticsRange,
} from "@/lib/analytics/queries";

export const instant = false;

type PageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const range = parseAnalyticsRange(params.range);
  const data = await getAnalyticsSummary(range);

  return <AnalyticsDashboard data={data} />;
}
