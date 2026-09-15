import { SupplementBrandEditor } from "@/components/admin/SupplementBrandEditor";
import { BackToSupplementBrandsLink } from "@/components/admin/SupplementBrandNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewSupplementBrandPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToSupplementBrandsLink>← Back to brands</BackToSupplementBrandsLink>
      </Button>
      <SupplementBrandEditor key={t ?? "new"} />
    </div>
  );
}
