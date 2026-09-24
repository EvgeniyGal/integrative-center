"use client";

import { Fragment } from "react";

import {
  deletePolicyAction,
  reorderPoliciesAction,
  setPolicyFlagAction,
} from "@/app/admin/actions/policies";
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
  PreviewToggle,
  usePreviewId,
} from "@/components/admin/TableActions";
import { ArticleBlocks } from "@/components/content/ArticleBlocks";
import type { Policy } from "@/lib/db/schema";

export function PoliciesTable({ items }: { items: Policy[] }) {
  const { toggle, isOpen } = usePreviewId();
  const { rows, handleDragEnd } = useSortableRows(items, reorderPoliciesAction);

  return (
    <SortableTableRoot
      id="admin-policies"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Title</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden lg:table-cell">
                Slug
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>TOC</AdminTableHeaderCell>
              <AdminTableHeaderCell>About</AdminTableHeaderCell>
              <AdminTableHeaderCell>Visible</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">
                Actions
              </AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <SortableTableBody>
            {rows.length === 0 ? (
              <AdminTableRow>
                <AdminTableCell colSpan={7} className="py-10 text-muted">
                  No policies yet.
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              rows.map((item) => {
                const open = isOpen(item.id);
                const body = Array.isArray(item.body) ? item.body : [];
                return (
                  <Fragment key={item.id}>
                    <SortableAdminTableRow id={item.id} selected={open}>
                      {({ attributes, listeners }) => (
                        <>
                          <OrderDragCell
                            order={item.sortOrder}
                            attributes={attributes}
                            listeners={listeners}
                          />
                          <AdminTableCell>
                            <p className="font-medium text-ink">{item.title}</p>
                          </AdminTableCell>
                          <AdminTableCell className="hidden lg:table-cell">
                            <p className="max-w-xs truncate text-muted">
                              {item.slug}
                            </p>
                          </AdminTableCell>
                          <AdminTableCell>
                            <StatusToggle
                              action={setPolicyFlagAction}
                              id={item.id}
                              field="showInToc"
                              value={item.showInToc}
                              onLabel="In TOC"
                              offLabel="No TOC"
                              onTone="info"
                              offTone="neutral"
                            />
                          </AdminTableCell>
                          <AdminTableCell>
                            <StatusToggle
                              action={setPolicyFlagAction}
                              id={item.id}
                              field="showOnAbout"
                              value={item.showOnAbout}
                              onLabel="On about"
                              offLabel="Off about"
                              onTone="info"
                              offTone="neutral"
                            />
                          </AdminTableCell>
                          <AdminTableCell>
                            <StatusToggle
                              action={setPolicyFlagAction}
                              id={item.id}
                              field="visible"
                              value={item.visible}
                              onLabel="Visible"
                              offLabel="Hidden"
                              onTone="success"
                              offTone="danger"
                            />
                          </AdminTableCell>
                          <AdminTableCell>
                            <div className="flex justify-end gap-1.5">
                              <PreviewToggle
                                open={open}
                                onToggle={() => toggle(item.id)}
                              />
                              <EditLink href={`/admin/policies/${item.id}`} />
                              <DeleteButton
                                action={deletePolicyAction}
                                id={item.id}
                              />
                            </div>
                          </AdminTableCell>
                        </>
                      )}
                    </SortableAdminTableRow>
                    {open ? (
                      <AdminTableRow>
                        <AdminTableCell
                          colSpan={7}
                          className="bg-stone/20 px-4 py-6"
                        >
                          {body.length > 0 ? (
                            <div className="max-h-80 overflow-y-auto text-sm">
                              <ArticleBlocks blocks={body} />
                            </div>
                          ) : (
                            <p className="text-sm text-muted">
                              No body content yet.
                            </p>
                          )}
                        </AdminTableCell>
                      </AdminTableRow>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </SortableTableBody>
        </AdminTableElement>
      </AdminTable>
    </SortableTableRoot>
  );
}
