"use client";

import { Fragment } from "react";

import {
  deleteContactSubmissionAction,
  retryContactEmailAction,
  setContactReadAction,
} from "@/app/admin/actions/inquiries";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  EmailNotifyCell,
  StatusToggle,
} from "@/components/admin/AdminTable";
import {
  DeleteButton,
  PreviewToggle,
  usePreviewId,
} from "@/components/admin/TableActions";
import type { ContactSubmission } from "@/lib/db/schema";

function formatDate(value: string | Date) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ContactSubmissionsTable({
  items,
}: {
  items: ContactSubmission[];
}) {
  const { toggle, isOpen } = usePreviewId();

  return (
    <AdminTable>
      <AdminTableElement>
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell>Received</AdminTableHeaderCell>
            <AdminTableHeaderCell>Name</AdminTableHeaderCell>
            <AdminTableHeaderCell>Email</AdminTableHeaderCell>
            <AdminTableHeaderCell className="hidden md:table-cell">
              Phone
            </AdminTableHeaderCell>
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
              <AdminTableCell colSpan={7} className="py-10 text-muted">
                No contact requests yet.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            items.map((item) => {
              const open = isOpen(item.id);
              const name = `${item.firstName} ${item.lastName}`.trim();
              return (
                <Fragment key={item.id}>
                  <AdminTableRow selected={open}>
                    <AdminTableCell className="whitespace-nowrap text-muted">
                      {formatDate(item.createdAt)}
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="font-medium text-ink">{name}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <a
                        href={`mailto:${item.email}`}
                        className="text-brand hover:underline"
                      >
                        {item.email}
                      </a>
                    </AdminTableCell>
                    <AdminTableCell className="hidden md:table-cell">
                      <a
                        href={`tel:${item.phone}`}
                        className="text-ink hover:underline"
                      >
                        {item.phone}
                      </a>
                    </AdminTableCell>
                    <AdminTableCell>
                      <StatusToggle
                        action={setContactReadAction}
                        id={item.id}
                        field="read"
                        value={item.status === "read"}
                        onLabel="Read"
                        offLabel="New"
                        onTone="neutral"
                        offTone="warning"
                      />
                    </AdminTableCell>
                    <AdminTableCell className="hidden lg:table-cell">
                      <EmailNotifyCell
                        sent={item.emailSent}
                        error={item.emailError}
                        retryAction={retryContactEmailAction}
                        id={item.id}
                      />
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="flex justify-end gap-1.5">
                        <PreviewToggle
                          open={open}
                          onToggle={() => toggle(item.id)}
                        />
                        <DeleteButton
                          action={deleteContactSubmissionAction}
                          id={item.id}
                          label={`${name}'s request`}
                        />
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                  {open ? (
                    <tr className="bg-stone/15">
                      <td colSpan={7} className="px-5 py-5">
                        <div className="border border-ink/10 bg-ivory p-5">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                            Message
                          </p>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink">
                            {item.message}
                          </p>
                          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                            <div>
                              <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">
                                Phone
                              </dt>
                              <dd className="mt-1">{item.phone}</dd>
                            </div>
                            <div>
                              <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">
                                Email
                              </dt>
                              <dd className="mt-1">{item.email}</dd>
                            </div>
                            <div>
                              <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">
                                Received
                              </dt>
                              <dd className="mt-1">{formatDate(item.createdAt)}</dd>
                            </div>
                            {item.emailError ? (
                              <div className="sm:col-span-3">
                                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">
                                  Email delivery
                                </dt>
                                <dd className="mt-1 text-red-700">{item.emailError}</dd>
                              </div>
                            ) : null}
                          </dl>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </AdminTableBody>
      </AdminTableElement>
    </AdminTable>
  );
}
