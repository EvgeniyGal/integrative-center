import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { ProductCategoryEditor } from "@/components/admin/ProductCategoryEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { productCategories } from "@/lib/db/schema";

export const instant = false;

export default async function EditProductCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.id, id))
    .limit(1);
  const category = rows[0];
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/product-categories">← Back to categories</Link>
      </Button>
      <ProductCategoryEditor category={category} />
    </div>
  );
}
