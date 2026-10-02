"use client";

import Image from "next/image";

import {
  deleteCareGuideAction,
  reorderCareGuidesAction,
  setCareGuidePublishedAction,
} from "@/app/admin/actions/care-guides";
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
import type { CareGuide } from "@/lib/db/schema";

export function CareGuidesTable({ items }: { items: CareGuide[] }) {
  const { rows, handleDragEnd } = useSortableRows(
    items,
    reorderCareGuidesAction,
  );

  return (
    <SortableTableRoot
      id="admin-care-guides"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Guide</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden md:table-cell">
                Action
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
                  No care guides yet.
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
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-brand-light">
                            <Image
                              src={item.imageUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-ink">{item.title}</p>
                            <p className="truncate text-sm text-muted">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </AdminTableCell>
                      <AdminTableCell className="hidden md:table-cell">
                        <p className="text-sm text-muted">
                          {item.actionType === "pdf"
                            ? `PDF · ${item.pdfFileName || "document"}`
                            : "External link"}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <StatusToggle
                          action={setCareGuidePublishedAction}
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
                          <EditLink href={`/admin/care-guides/${item.id}`} />
                          <DeleteButton
                            action={deleteCareGuideAction}
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
