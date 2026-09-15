import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { StoreBrandEditor } from "@/components/admin/StoreBrandEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { storeBrands } from "@/lib/db/schema";

export const instant = false;

export default async function EditStoreBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(storeBrands)
    .where(eq(storeBrands.id, id))
    .limit(1);
  const brand = rows[0];
  if (!brand) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/store-brands">← Back to store buttons</Link>
      </Button>
      <StoreBrandEditor brand={brand} />
    </div>
  );
}
