import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { BackToServicesLink } from "@/components/admin/ServiceNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToServicesLink>← Back to services</BackToServicesLink>
      </Button>
      <ServiceEditor key={t ?? "new"} />
    </div>
  );
}
