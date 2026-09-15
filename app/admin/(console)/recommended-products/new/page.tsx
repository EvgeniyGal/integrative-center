import { RecommendedProductEditor } from "@/components/admin/RecommendedProductEditor";
import { BackToRecommendedProductsLink } from "@/components/admin/RecommendedProductNav";
import { Button } from "@/components/ui/button";
import {
  getAllProductCategories,
  getAllStoreBrands,
} from "@/lib/content/queries";

export const instant = false;

export default async function NewRecommendedProductPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const [categories, storeBrands] = await Promise.all([
    getAllProductCategories(),
    getAllStoreBrands(),
  ]);

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToRecommendedProductsLink>
          ← Back to products
        </BackToRecommendedProductsLink>
      </Button>
      <RecommendedProductEditor
        key={t ?? "new"}
        categories={categories}
        storeBrands={storeBrands}
      />
    </div>
  );
}
