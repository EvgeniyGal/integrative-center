import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import {
  setAdminStatusAction,
  updateAdminUserAction,
  deleteAdminUserAction,
} from "@/app/admin/actions/auth";
import { AdminForm, Field } from "@/components/admin/AdminForm";
import { StatusBadge } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/button";
import { requireUserManager } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const instant = false;

export default async function EditAdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUserManager();
  const { id } = await params;
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!user) notFound();

  const isSelf = user.id === session.user.id;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/users">← Back to admins</Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={user.status === "active" ? "success" : "danger"}>
          {user.status}
        </StatusBadge>
        {isSelf ? (
          <span className="text-[11px] uppercase tracking-[0.16em] text-brand">
            Your account
          </span>
        ) : null}
      </div>

      <div className="border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Profile</h2>
        <AdminForm action={updateAdminUserAction} submitLabel="Save changes">
          <input type="hidden" name="id" value={user.id} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              name="name"
              defaultValue={user.name ?? ""}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />
          </div>
        </AdminForm>
      </div>

      <div className="flex flex-wrap gap-3 border border-ink/10 bg-ivory p-6">
        <form action={setAdminStatusAction}>
          <input type="hidden" name="id" value={user.id} />
          <input
            type="hidden"
            name="status"
            value={user.status === "active" ? "disabled" : "active"}
          />
          <Button
            type="submit"
            variant="outline"
            className="rounded-none"
            disabled={isSelf && user.status === "active"}
          >
            {user.status === "active" ? "Disable account" : "Enable account"}
          </Button>
        </form>
        <form action={deleteAdminUserAction}>
          <input type="hidden" name="id" value={user.id} />
          <Button
            type="submit"
            variant="outline"
            className="rounded-none text-red-700 hover:border-red-700"
            disabled={isSelf}
          >
            Delete account
          </Button>
        </form>
      </div>
    </div>
  );
}
