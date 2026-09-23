import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { PolicyDocument } from "@/components/legal/PolicyDocument";
import { pageMetadata, pages } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(pages.privacyPolicy);

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell eyebrow="Legal" title="Privacy Policy">
      <PolicyDocument slug="privacy-policy" />
    </LegalPageShell>
  );
}
