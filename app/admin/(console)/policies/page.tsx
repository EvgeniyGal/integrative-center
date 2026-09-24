import { PoliciesTable } from "@/components/admin/PoliciesTable";
import { AddPolicyButton } from "@/components/admin/PolicyNav";
import { getAllPolicies } from "@/lib/content/queries";

export const instant = false;

export default async function AdminPoliciesPage() {
  const items = await getAllPolicies();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Hide a policy without deleting it. Toggle “TOC” for the policies page
          nav, and “Show on About” for About teaser cards.
        </p>
        <AddPolicyButton className="rounded-none" />
      </div>
      <PoliciesTable items={items} />
    </div>
  );
}
