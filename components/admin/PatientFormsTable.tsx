"use client";

import { FileText } from "lucide-react";

import {
  deletePatientFormAction,
  reorderPatientFormsAction,
  setPatientFormPublishedAction,
} from "@/app/admin/actions/patient-forms";
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
import type { PatientForm } from "@/lib/db/schema";

export function PatientFormsTable({ items }: { items: PatientForm[] }) {
  const { rows, handleDragEnd } = useSortableRows(
    items,
    reorderPatientFormsAction,
  );

  return (
    <SortableTableRoot
      id="admin-patient-forms"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Form</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden md:table-cell">
                File
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
                  No patient forms yet.
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
                          <div className="flex size-10 shrink-0 items-center justify-center bg-brand-light text-brand">
                            <FileText className="size-5" strokeWidth={1.5} />
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
                        <p className="truncate text-sm text-muted">
                          {item.pdfFileName || "document.pdf"}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <StatusToggle
                          action={setPatientFormPublishedAction}
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
                          <EditLink href={`/admin/patient-forms/${item.id}`} />
                          <DeleteButton
                            action={deletePatientFormAction}
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
