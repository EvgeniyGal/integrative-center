import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { PolicyDocument } from "@/components/legal/PolicyDocument";
import { pageMetadata, pages } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(pages.hipaaNotice);

export default function HipaaNoticePage() {
  return (
    <LegalPageShell eyebrow="Legal" title="HIPAA Notice">
      <PolicyDocument slug="hipaa-notice" />
    </LegalPageShell>
  );
}
