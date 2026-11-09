import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { TeamMemberEditor } from "@/components/admin/TeamMemberEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

export const instant = false;

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);
  const member = rows[0];
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/team-members">← Back to team</Link>
      </Button>
      <TeamMemberEditor member={member} />
    </div>
  );
}
