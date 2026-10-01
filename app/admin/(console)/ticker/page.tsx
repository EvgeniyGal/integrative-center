import { eq } from "drizzle-orm";

import { TickerEditor } from "@/components/admin/TickerEditor";
import { db } from "@/lib/db";
import { SITE_SETTINGS_ID, siteSettings } from "@/lib/db/schema";
import { defaultTickerText } from "@/lib/site";

export const instant = false;

export default async function AdminTickerPage() {
  const rows = await db
    .select({ tickerText: siteSettings.tickerText })
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);

  const initialText = rows[0]?.tickerText?.trim() || defaultTickerText;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-muted">
        Edit the full announcement string shown in the scrolling bar under the
        site header.
      </p>
      <TickerEditor initialText={initialText} />
    </div>
  );
}
