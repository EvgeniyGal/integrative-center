import { ProductCategoryEditor } from "@/components/admin/ProductCategoryEditor";
import { BackToProductCategoriesLink } from "@/components/admin/ProductCategoryNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewProductCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToProductCategoriesLink>
          ← Back to categories
        </BackToProductCategoriesLink>
      </Button>
      <ProductCategoryEditor key={t ?? "new"} />
    </div>
  );
}
