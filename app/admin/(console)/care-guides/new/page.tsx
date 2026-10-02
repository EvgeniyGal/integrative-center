import { CareGuideEditor } from "@/components/admin/CareGuideEditor";
import { BackToCareGuidesLink } from "@/components/admin/CareGuideNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewCareGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToCareGuidesLink>← Back to care guides</BackToCareGuidesLink>
      </Button>
      <CareGuideEditor key={t ?? "new"} />
    </div>
  );
}
