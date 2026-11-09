import { TeamMembersTable } from "@/components/admin/TeamMembersTable";
import { AddTeamMemberButton } from "@/components/admin/TeamMemberNav";
import { getAllTeamMembers } from "@/lib/content/queries";

export const instant = false;

export default async function AdminTeamMembersPage() {
  const items = await getAllTeamMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Team members shown on the About page. The first published member by
          sort order is featured on the home page.
        </p>
        <AddTeamMemberButton className="rounded-none" />
      </div>
      <TeamMembersTable items={items} />
    </div>
  );
}
