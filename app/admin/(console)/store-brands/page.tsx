import { StoreBrandsTable } from "@/components/admin/StoreBrandsTable";
import { AddStoreBrandButton } from "@/components/admin/StoreBrandNav";
import {
  getAllRecommendedProducts,
  getAllStoreBrands,
} from "@/lib/content/queries";

export const instant = false;

export default async function AdminStoreBrandsPage() {
  const [items, products] = await Promise.all([
    getAllStoreBrands(),
    getAllRecommendedProducts(),
  ]);

  const productCountById: Record<string, number> = {};
  for (const product of products) {
    productCountById[product.storeBrandId] =
      (productCountById[product.storeBrandId] ?? 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Shared store button styles (logo + label) used on product CTAs. Create
          Amazon once, then reuse it across products.
        </p>
        <AddStoreBrandButton className="rounded-none" />
      </div>
      <StoreBrandsTable items={items} productCountById={productCountById} />
    </div>
  );
}
