import { TeamMemberEditor } from "@/components/admin/TeamMemberEditor";
import { BackToTeamMembersLink } from "@/components/admin/TeamMemberNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewTeamMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToTeamMembersLink>← Back to team</BackToTeamMembersLink>
      </Button>
      <TeamMemberEditor key={t ?? "new"} />
    </div>
  );
}
