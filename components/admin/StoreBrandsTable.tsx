"use client";

import Image from "next/image";

import {
  deleteStoreBrandAction,
  reorderStoreBrandsAction,
  setStoreBrandPublishedAction,
} from "@/app/admin/actions/store-brands";
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
import type { StoreBrand } from "@/lib/db/schema";

export function StoreBrandsTable({
  items,
  productCountById,
}: {
  items: StoreBrand[];
  productCountById: Record<string, number>;
}) {
  const { rows, handleDragEnd } = useSortableRows(
    items,
    reorderStoreBrandsAction,
  );

  return (
    <SortableTableRoot
      id="admin-store-brands"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Store</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden sm:table-cell">
                Button label
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
                  No store buttons yet.
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              rows.map((item) => {
                const productCount = productCountById[item.id] ?? 0;
                const inUse = productCount > 0;

                return (
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
                            <div className="relative h-8 w-14 shrink-0 overflow-hidden bg-stone/40">
                              <Image
                                src={item.logoUrl}
                                alt=""
                                fill
                                className="object-contain"
                                sizes="56px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-ink">{item.name}</p>
                              {inUse ? (
                                <p className="text-xs text-muted">
                                  Used by {productCount}{" "}
                                  {productCount === 1 ? "product" : "products"}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </AdminTableCell>
                        <AdminTableCell className="hidden sm:table-cell">
                          {item.ctaLabel}
                        </AdminTableCell>
                        <AdminTableCell>
                          <StatusToggle
                            action={setStoreBrandPublishedAction}
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
                            <EditLink href={`/admin/store-brands/${item.id}`} />
                            <DeleteButton
                              action={deleteStoreBrandAction}
                              id={item.id}
                              disabled={inUse}
                              disabledTitle="Reassign products before deleting this store button"
                              label={`“${item.name}”`}
                            />
                          </div>
                        </AdminTableCell>
                      </>
                    )}
                  </SortableAdminTableRow>
                );
              })
            )}
          </SortableTableBody>
        </AdminTableElement>
      </AdminTable>
    </SortableTableRoot>
  );
}
