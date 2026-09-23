import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { PolicyDocument } from "@/components/legal/PolicyDocument";
import { pageMetadata, pages } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(pages.cookiePolicy);

export default function CookiePolicyPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Cookie Policy">
      <PolicyDocument slug="cookie-policy" />
    </LegalPageShell>
  );
}
