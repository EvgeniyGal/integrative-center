import { desc, isNull } from "drizzle-orm";

import { AdminsTable, InvitesTable } from "@/components/admin/AdminsTable";
import { InviteAdminForm } from "@/components/admin/InviteAdminForm";
import { requireUserManager } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { adminInvites, users } from "@/lib/db/schema";

export const instant = false;

export default async function AdminUsersPage() {
  const session = await requireUserManager();

  const [adminUsers, invites] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    db
      .select()
      .from(adminInvites)
      .where(isNull(adminInvites.acceptedAt))
      .orderBy(desc(adminInvites.createdAt)),
  ]);

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-muted">
        Invite new admins by email. Disable access without deleting the account
        when someone leaves.
      </p>

      <section className="border border-ink/10 bg-ivory px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl">Send invite</h2>
        </div>
        <InviteAdminForm />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Pending invites</h2>
        <InvitesTable items={invites} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Admin users</h2>
        <AdminsTable items={adminUsers} currentUserId={session.user.id} />
      </section>
    </div>
  );
}
