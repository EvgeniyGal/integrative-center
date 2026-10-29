import { PatientFormsTable } from "@/components/admin/PatientFormsTable";
import { AddPatientFormButton } from "@/components/admin/PatientFormNav";
import { getAllPatientForms } from "@/lib/content/queries";

export const instant = false;

export default async function AdminPatientFormsPage() {
  const items = await getAllPatientForms();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Patient forms shown on the public forms page — each card includes a
          PDF preview and download.
        </p>
        <AddPatientFormButton className="rounded-none" />
      </div>
      <PatientFormsTable items={items} />
    </div>
  );
}
