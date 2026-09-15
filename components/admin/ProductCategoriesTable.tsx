"use client";

import {
  deleteProductCategoryAction,
  reorderProductCategoriesAction,
  setProductCategoryPublishedAction,
} from "@/app/admin/actions/product-categories";
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
import type { ProductCategory } from "@/lib/db/schema";

export function ProductCategoriesTable({
  items,
  productCountByName,
}: {
  items: ProductCategory[];
  productCountByName: Record<string, number>;
}) {
  const { rows, handleDragEnd } = useSortableRows(
    items,
    reorderProductCategoriesAction,
  );

  return (
    <SortableTableRoot
      id="admin-product-categories"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Name</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">
                Actions
              </AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <SortableTableBody>
            {rows.length === 0 ? (
              <AdminTableRow>
                <AdminTableCell colSpan={4} className="py-10 text-muted">
                  No categories yet.
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              rows.map((item) => {
                const productCount = productCountByName[item.name] ?? 0;
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
                          <p className="font-medium text-ink">{item.name}</p>
                          {inUse ? (
                            <p className="mt-0.5 text-xs text-muted">
                              Used by {productCount}{" "}
                              {productCount === 1 ? "product" : "products"}
                            </p>
                          ) : null}
                        </AdminTableCell>
                        <AdminTableCell>
                          <StatusToggle
                            action={setProductCategoryPublishedAction}
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
                              href={`/admin/product-categories/${item.id}`}
                            />
                            <DeleteButton
                              action={deleteProductCategoryAction}
                              id={item.id}
                              disabled={inUse}
                              disabledTitle="Reassign products before deleting this category"
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
