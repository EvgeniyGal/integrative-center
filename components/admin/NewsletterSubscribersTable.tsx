"use client";

import {
  deleteSubscriberAction,
  setSubscriberActiveAction,
} from "@/app/admin/actions/inquiries";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  StatusBadge,
  StatusToggle,
} from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/TableActions";
import type { NewsletterSubscriber } from "@/lib/db/schema";

function formatDate(value: string | Date) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function displayName(item: NewsletterSubscriber) {
  const name = `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim();
  return name || "—";
}

export function NewsletterSubscribersTable({
  items,
}: {
  items: NewsletterSubscriber[];
}) {
  return (
    <AdminTable>
      <AdminTableElement>
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell>Joined</AdminTableHeaderCell>
            <AdminTableHeaderCell>Name</AdminTableHeaderCell>
            <AdminTableHeaderCell>Email</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell className="hidden lg:table-cell">
              Notify
            </AdminTableHeaderCell>
            <AdminTableHeaderCell className="text-right">
              Actions
            </AdminTableHeaderCell>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {items.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={6} className="py-10 text-muted">
                No newsletter subscribers yet.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            items.map((item) => (
              <AdminTableRow key={item.id}>
                <AdminTableCell className="whitespace-nowrap text-muted">
                  {formatDate(item.createdAt)}
                </AdminTableCell>
                <AdminTableCell>
                  <p className="font-medium text-ink">{displayName(item)}</p>
                </AdminTableCell>
                <AdminTableCell>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-brand hover:underline"
                  >
                    {item.email}
                  </a>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusToggle
                    action={setSubscriberActiveAction}
                    id={item.id}
                    field="active"
                    value={item.status === "active"}
                    onLabel="Active"
                    offLabel="Unsubscribed"
                    onTone="success"
                    offTone="neutral"
                  />
                </AdminTableCell>
                <AdminTableCell className="hidden lg:table-cell">
                  <StatusBadge tone={item.emailSent ? "success" : "warning"}>
                    {item.emailSent ? "Sent" : "Not sent"}
                  </StatusBadge>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex justify-end">
                    <DeleteButton
                      action={deleteSubscriberAction}
                      id={item.id}
                      label={item.email}
                    />
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTableElement>
    </AdminTable>
  );
}
