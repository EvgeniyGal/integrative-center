import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { RecommendedProductEditor } from "@/components/admin/RecommendedProductEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { recommendedProducts } from "@/lib/db/schema";

export const instant = false;

export default async function EditRecommendedProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.query.recommendedProducts.findFirst({
    where: eq(recommendedProducts.id, id),
  });
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/recommended-products">← Back to products</Link>
      </Button>
      <RecommendedProductEditor product={product} />
    </div>
  );
}
