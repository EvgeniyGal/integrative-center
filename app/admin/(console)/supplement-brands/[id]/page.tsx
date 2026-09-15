import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { SupplementBrandEditor } from "@/components/admin/SupplementBrandEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { supplementBrands } from "@/lib/db/schema";

export const instant = false;

export default async function EditSupplementBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await db.query.supplementBrands.findFirst({
    where: eq(supplementBrands.id, id),
  });
  if (!brand) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/supplement-brands">← Back to brands</Link>
      </Button>
      <SupplementBrandEditor brand={brand} />
    </div>
  );
}
