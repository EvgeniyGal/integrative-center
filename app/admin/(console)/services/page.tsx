import { ServicesTable } from "@/components/admin/ServicesTable";
import { AddServiceButton } from "@/components/admin/ServiceNav";
import { getAllServices } from "@/lib/content/queries";

export const instant = false;

export default async function AdminServicesPage() {
  const items = await getAllServices();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Hide a service without deleting it. Toggle homepage placement with
          “Show on home”.
        </p>
        <AddServiceButton className="rounded-none" />
      </div>
      <ServicesTable items={items} />
    </div>
  );
}
