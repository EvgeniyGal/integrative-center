"use client";

import { Ban, CheckCircle2, Trash2 } from "lucide-react";

import {
  deleteAdminUserAction,
  removeInviteAction,
  setAdminRoleAction,
  setAdminStatusAction,
} from "@/app/admin/actions/auth";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  StatusBadge,
} from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/button";
import type { AdminInvite, User } from "@/lib/db/schema";

type SerializedUser = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
  emailVerified: string | Date | null;
};

type SerializedInvite = Omit<
  AdminInvite,
  "createdAt" | "expiresAt" | "acceptedAt"
> & {
  createdAt: string | Date;
  expiresAt: string | Date;
  acceptedAt: string | Date | null;
};

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function AdminsTable({
  items,
  currentUserId,
}: {
  items: SerializedUser[];
  currentUserId: string;
}) {
  return (
    <AdminTable>
      <AdminTableElement>
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell>Name</AdminTableHeaderCell>
            <AdminTableHeaderCell>Email</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell>Role</AdminTableHeaderCell>
            <AdminTableHeaderCell className="hidden lg:table-cell">
              Created
            </AdminTableHeaderCell>
            <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {items.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={6} className="py-10 text-muted">
                No admin users yet.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            items.map((user) => {
              const isSelf = user.id === currentUserId;
              const isActive = user.status === "active";
              return (
                <AdminTableRow key={user.id}>
                  <AdminTableCell>
                    <p className="font-medium text-ink">
                      {user.name || "—"}
                      {isSelf ? (
                        <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-brand">
                          You
                        </span>
                      ) : null}
                    </p>
                  </AdminTableCell>
                  <AdminTableCell>
                    <p className="text-muted">{user.email}</p>
                  </AdminTableCell>
                  <AdminTableCell>
                    <StatusBadge tone={isActive ? "success" : "danger"}>
                      {user.status}
                    </StatusBadge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <form action={setAdminRoleAction}>
                      <input type="hidden" name="id" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        disabled={isSelf}
                        aria-label={`Role for ${user.email}`}
                        onChange={(event) => event.currentTarget.form?.requestSubmit()}
                        className="h-9 min-w-[7.5rem] border border-ink/15 bg-ivory px-2 text-sm text-ink outline-none transition hover:border-brand focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                      </select>
                    </form>
                  </AdminTableCell>
                  <AdminTableCell className="hidden lg:table-cell text-muted">
                    {formatDate(user.createdAt)}
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="flex flex-wrap justify-end gap-2">
                      <form action={setAdminStatusAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={isActive ? "disabled" : "active"}
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          size="icon-sm"
                          className="border-ink/15"
                          disabled={isSelf && isActive}
                          title={isActive ? "Disable account" : "Enable account"}
                          aria-label={
                            isActive ? "Disable account" : "Enable account"
                          }
                        >
                          {isActive ? (
                            <Ban className="size-4" />
                          ) : (
                            <CheckCircle2 className="size-4 text-brand" />
                          )}
                        </Button>
                      </form>
                      <form action={deleteAdminUserAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="icon-sm"
                          className="border-ink/15 text-red-700 hover:border-red-700 hover:text-red-800"
                          disabled={isSelf}
                          title="Delete account"
                          aria-label="Delete account"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </form>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          )}
        </AdminTableBody>
      </AdminTableElement>
    </AdminTable>
  );
}

export function InvitesTable({ items }: { items: SerializedInvite[] }) {
  return (
    <AdminTable>
      <AdminTableElement>
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell>Email</AdminTableHeaderCell>
            <AdminTableHeaderCell>Expires</AdminTableHeaderCell>
            <AdminTableHeaderCell className="hidden sm:table-cell">
              Sent
            </AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {items.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={5} className="py-10 text-muted">
                No pending invites.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            items.map((invite) => {
              const expired = new Date(invite.expiresAt) < new Date();
              return (
                <AdminTableRow key={invite.id}>
                  <AdminTableCell>
                    <p className="font-medium text-ink">{invite.email}</p>
                  </AdminTableCell>
                  <AdminTableCell className="text-muted">
                    {formatDate(invite.expiresAt)}
                  </AdminTableCell>
                  <AdminTableCell className="hidden sm:table-cell text-muted">
                    {formatDate(invite.createdAt)}
                  </AdminTableCell>
                  <AdminTableCell>
                    <StatusBadge tone={expired ? "danger" : "warning"}>
                      {expired ? "Expired" : "Pending"}
                    </StatusBadge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="flex justify-end">
                      <form action={removeInviteAction}>
                        <input type="hidden" name="id" value={invite.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="icon-sm"
                          className="border-ink/15 text-red-700 hover:border-red-700"
                          title="Remove invite"
                          aria-label="Remove invite"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </form>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          )}
        </AdminTableBody>
      </AdminTableElement>
    </AdminTable>
  );
}
