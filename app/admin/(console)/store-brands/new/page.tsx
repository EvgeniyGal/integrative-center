import { StoreBrandEditor } from "@/components/admin/StoreBrandEditor";
import { BackToStoreBrandsLink } from "@/components/admin/StoreBrandNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewStoreBrandPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToStoreBrandsLink>← Back to store buttons</BackToStoreBrandsLink>
      </Button>
      <StoreBrandEditor key={t ?? "new"} />
    </div>
  );
}
