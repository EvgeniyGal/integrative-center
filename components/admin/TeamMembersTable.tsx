"use client";

import Image from "next/image";

import {
  deleteTeamMemberAction,
  reorderTeamMembersAction,
  setTeamMemberPublishedAction,
} from "@/app/admin/actions/team-members";
import {
  AdminTable,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  StatusToggle,
} from "@/components/admin/AdminTable";
import {
  OrderDragCell,
  SortableAdminTableRow,
  SortableTableBody,
  SortableTableRoot,
  useSortableRows,
} from "@/components/admin/SortableTable";
import { DeleteButton, EditLink } from "@/components/admin/TableActions";
import type { TeamMember } from "@/lib/db/schema";

export function TeamMembersTable({ items }: { items: TeamMember[] }) {
  const { rows, handleDragEnd } = useSortableRows(
    items,
    reorderTeamMembersAction,
  );

  return (
    <SortableTableRoot
      id="admin-team-members"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Member</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden md:table-cell">
                Role
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">
                Actions
              </AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <SortableTableBody>
            {rows.length === 0 ? (
              <AdminTableRow>
                <AdminTableCell colSpan={5} className="py-10 text-muted">
                  No team members yet.
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              rows.map((item) => (
                <SortableAdminTableRow key={item.id} id={item.id}>
                  {({ attributes, listeners }) => (
                    <>
                      <OrderDragCell
                        order={item.sortOrder}
                        attributes={attributes}
                        listeners={listeners}
                      />
                      <AdminTableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden bg-brand-light">
                            <Image
                              src={item.imageUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-ink">{item.name}</p>
                            <p className="truncate text-sm text-muted md:hidden">
                              {item.role}
                            </p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="hidden md:table-cell">
                        <p className="truncate text-sm text-muted">{item.role}</p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <StatusToggle
                          action={setTeamMemberPublishedAction}
                          id={item.id}
                          field="published"
                          value={item.published}
                          onLabel="Published"
                          offLabel="Hidden"
                          onTone="success"
                          offTone="neutral"
                        />
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex justify-end gap-1.5">
                          <EditLink href={`/admin/team-members/${item.id}`} />
                          <DeleteButton
                            action={deleteTeamMemberAction}
                            id={item.id}
                          />
                        </div>
                      </AdminTableCell>
                    </>
                  )}
                </SortableAdminTableRow>
              ))
            )}
          </SortableTableBody>
        </AdminTableElement>
      </AdminTable>
    </SortableTableRoot>
  );
}
