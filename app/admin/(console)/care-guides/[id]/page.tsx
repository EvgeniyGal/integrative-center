import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { CareGuideEditor } from "@/components/admin/CareGuideEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { careGuides } from "@/lib/db/schema";

export const instant = false;

export default async function EditCareGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(careGuides)
    .where(eq(careGuides.id, id))
    .limit(1);
  const guide = rows[0];
  if (!guide) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/care-guides">← Back to care guides</Link>
      </Button>
      <CareGuideEditor guide={guide} />
    </div>
  );
}
