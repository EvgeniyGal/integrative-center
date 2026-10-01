import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { JsonLd } from "@/components/JsonLd";
import { isChatWidgetEnabled } from "@/lib/ai/settings";
import { getTickerText } from "@/lib/content/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatEnabled, tickerText] = await Promise.all([
    isChatWidgetEnabled(),
    getTickerText(),
  ]);

  return (
    <>
      <JsonLd />
      <AnalyticsTracker />
      <Header tickerText={tickerText} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingActions chatEnabled={chatEnabled} />
    </>
  );
}
