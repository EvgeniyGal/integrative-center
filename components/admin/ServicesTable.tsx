"use client";

import { Fragment } from "react";
import Image from "next/image";

import {
  deleteServiceAction,
  reorderServicesAction,
  setServiceFlagAction,
} from "@/app/admin/actions/services";
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
  ServiceDetailPreview,
  ServiceHomePreview,
} from "@/components/admin/ContentPreviews";
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
import type { Service } from "@/lib/db/schema";
import { normalizeServiceBody } from "@/lib/content/service-body";

export function ServicesTable({ items }: { items: Service[] }) {
  const { toggle, isOpen } = usePreviewId();
  const { rows, handleDragEnd } = useSortableRows(items, reorderServicesAction);

  return (
    <SortableTableRoot
      id="admin-services"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell className="w-16">Image</AdminTableHeaderCell>
              <AdminTableHeaderCell>Service</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden lg:table-cell">
                Summary
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>Home</AdminTableHeaderCell>
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
                No services yet.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            rows.map((item) => {
              const open = isOpen(item.id);
              const body = normalizeServiceBody(item.body);
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
                          <div className="relative size-12 overflow-hidden bg-stone">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : null}
                          </div>
                        </AdminTableCell>
                        <AdminTableCell>
                          <p className="font-medium text-ink">{item.title}</p>
                          <p className="mt-1 text-xs text-muted">
                            {item.eyebrow} · /{item.slug}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell className="hidden lg:table-cell">
                          <p className="max-w-sm truncate text-muted">
                            {item.summary}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell>
                          <StatusToggle
                            action={setServiceFlagAction}
                            id={item.id}
                            field="showOnHome"
                            value={item.showOnHome}
                            onLabel="On home"
                            offLabel="Off home"
                            onTone="info"
                            offTone="neutral"
                          />
                        </AdminTableCell>
                        <AdminTableCell>
                          <StatusToggle
                            action={setServiceFlagAction}
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
                            <EditLink href={`/admin/services/${item.id}`} />
                            <DeleteButton
                              action={deleteServiceAction}
                              id={item.id}
                            />
                          </div>
                        </AdminTableCell>
                      </>
                    )}
                  </SortableAdminTableRow>
                  {open ? (
                    <tr className="bg-stone/15">
                      <td colSpan={7} className="px-5 py-5">
                        <div className="grid gap-5 xl:grid-cols-2">
                          <ServiceHomePreview
                            title={item.title}
                            eyebrow={item.eyebrow}
                            summary={item.summary}
                            imageUrl={item.imageUrl}
                          />
                          <ServiceDetailPreview
                            title={item.title}
                            eyebrow={item.eyebrow}
                            summary={item.summary}
                            body={body}
                            imageUrl={item.imageUrl}
                          />
                        </div>
                      </td>
                    </tr>
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
