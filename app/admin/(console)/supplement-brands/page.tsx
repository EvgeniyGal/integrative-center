import { SupplementBrandsTable } from "@/components/admin/SupplementBrandsTable";
import { AddSupplementBrandButton } from "@/components/admin/SupplementBrandNav";
import { getAllSupplementBrands } from "@/lib/content/queries";

export const instant = false;

export default async function AdminSupplementBrandsPage() {
  const items = await getAllSupplementBrands();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          HBIC-recommended supplement brands on the patient resources
          supplements page.
        </p>
        <AddSupplementBrandButton className="rounded-none" />
      </div>
      <SupplementBrandsTable items={items} />
    </div>
  );
}
