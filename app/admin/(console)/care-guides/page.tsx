import { CareGuidesTable } from "@/components/admin/CareGuidesTable";
import { AddCareGuideButton } from "@/components/admin/CareGuideNav";
import { getAllCareGuides } from "@/lib/content/queries";

export const instant = false;

export default async function AdminCareGuidesPage() {
  const items = await getAllCareGuides();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Patient care guides on the patient resources page — each card can open
          an external link or download a PDF.
        </p>
        <AddCareGuideButton className="rounded-none" />
      </div>
      <CareGuidesTable items={items} />
    </div>
  );
}
