import { RecommendedProductsTable } from "@/components/admin/RecommendedProductsTable";
import { AddRecommendedProductButton } from "@/components/admin/RecommendedProductNav";
import { getAllRecommendedProducts } from "@/lib/content/queries";

export const instant = false;

export default async function AdminRecommendedProductsPage() {
  const items = await getAllRecommendedProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Curated store products with categories and referral links for the
          supplements page.
        </p>
        <AddRecommendedProductButton className="rounded-none" />
      </div>
      <RecommendedProductsTable items={items} />
    </div>
  );
}
