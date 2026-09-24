import { PolicyEditor } from "@/components/admin/PolicyEditor";
import { BackToPoliciesLink } from "@/components/admin/PolicyNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewPolicyPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToPoliciesLink>← Back to policies</BackToPoliciesLink>
      </Button>
      <PolicyEditor key={t ?? "new"} />
    </div>
  );
}
