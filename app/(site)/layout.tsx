import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { JsonLd } from "@/components/JsonLd";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
