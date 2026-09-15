"use client";

import Image from "next/image";

import {
  deleteRecommendedProductAction,
  reorderRecommendedProductsAction,
  setRecommendedProductPublishedAction,
} from "@/app/admin/actions/recommended-products";
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
import type { RecommendedProduct } from "@/lib/db/schema";

export function RecommendedProductsTable({
  items,
}: {
  items: RecommendedProduct[];
}) {
  const { rows, handleDragEnd } = useSortableRows(
    items,
    reorderRecommendedProductsAction,
  );

  return (
    <SortableTableRoot
      id="admin-recommended-products"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Product</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden sm:table-cell">
                Category
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
                  No products yet.
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
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-stone/40">
                            <Image
                              src={item.imageUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
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
                      <AdminTableCell className="hidden sm:table-cell">
                        {item.category}
                      </AdminTableCell>
                      <AdminTableCell>
                        <StatusToggle
                          action={setRecommendedProductPublishedAction}
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
                            href={`/admin/recommended-products/${item.id}`}
                          />
                          <DeleteButton
                            action={deleteRecommendedProductAction}
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
