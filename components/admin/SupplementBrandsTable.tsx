"use client";

import Image from "next/image";

import {
  deleteSupplementBrandAction,
  reorderSupplementBrandsAction,
  setSupplementBrandPublishedAction,
} from "@/app/admin/actions/supplement-brands";
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
import {
  DeleteButton,
  EditLink,
} from "@/components/admin/TableActions";
import type { SupplementBrand } from "@/lib/db/schema";

export function SupplementBrandsTable({ items }: { items: SupplementBrand[] }) {
  const { rows, handleDragEnd } = useSortableRows(
    items,
    reorderSupplementBrandsAction,
  );

  return (
    <SortableTableRoot
      id="admin-supplement-brands"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Brand</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden md:table-cell">
                Discount
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
                  No brands yet.
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
                          <div className="relative h-10 w-16 shrink-0 overflow-hidden bg-stone/40">
                            <Image
                              src={item.logoUrl}
                              alt=""
                              fill
                              className="object-contain"
                              sizes="64px"
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
                          {item.discountText || "—"}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>
                        <StatusToggle
                          action={setSupplementBrandPublishedAction}
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
                          <EditLink
                            href={`/admin/supplement-brands/${item.id}`}
                          />
                          <DeleteButton
                            action={deleteSupplementBrandAction}
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
