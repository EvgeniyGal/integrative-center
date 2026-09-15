import { ProductCategoriesTable } from "@/components/admin/ProductCategoriesTable";
import { AddProductCategoryButton } from "@/components/admin/ProductCategoryNav";
import {
  getAllProductCategories,
  getAllRecommendedProducts,
} from "@/lib/content/queries";

export const instant = false;

export default async function AdminProductCategoriesPage() {
  const [items, products] = await Promise.all([
    getAllProductCategories(),
    getAllRecommendedProducts(),
  ]);

  const productCountByName: Record<string, number> = {};
  for (const product of products) {
    productCountByName[product.category] =
      (productCountByName[product.category] ?? 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Product filter categories for the supplements page. Assign them to
          products from the Products editor.
        </p>
        <AddProductCategoryButton className="rounded-none" />
      </div>
      <ProductCategoriesTable
        items={items}
        productCountByName={productCountByName}
      />
    </div>
  );
}
