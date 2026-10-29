import { PatientFormEditor } from "@/components/admin/PatientFormEditor";
import { BackToPatientFormsLink } from "@/components/admin/PatientFormNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewPatientFormPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToPatientFormsLink>← Back to patient forms</BackToPatientFormsLink>
      </Button>
      <PatientFormEditor key={t ?? "new"} />
    </div>
  );
}
