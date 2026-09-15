import { RecommendedProductEditor } from "@/components/admin/RecommendedProductEditor";
import { BackToRecommendedProductsLink } from "@/components/admin/RecommendedProductNav";
import { Button } from "@/components/ui/button";
import { getAllProductCategories } from "@/lib/content/queries";

export const instant = false;

export default async function NewRecommendedProductPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const categories = await getAllProductCategories();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToRecommendedProductsLink>
          ← Back to products
        </BackToRecommendedProductsLink>
      </Button>
      <RecommendedProductEditor key={t ?? "new"} categories={categories} />
    </div>
  );
}
