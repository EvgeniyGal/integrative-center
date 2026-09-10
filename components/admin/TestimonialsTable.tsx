"use client";

import { Fragment } from "react";

import {
  deleteTestimonialAction,
  reorderTestimonialsAction,
} from "@/app/admin/actions/testimonials";
import {
  AdminTable,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  StatusBadge,
} from "@/components/admin/AdminTable";
import { TestimonialPreview } from "@/components/admin/ContentPreviews";
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
import type { Testimonial } from "@/lib/db/schema";

export function TestimonialsTable({ items }: { items: Testimonial[] }) {
  const { toggle, isOpen } = usePreviewId();
  const { rows, handleDragEnd } = useSortableRows(
    items,
    reorderTestimonialsAction,
  );

  return (
    <SortableTableRoot
      id="admin-testimonials"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Title</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden md:table-cell">
                Quote
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>Name</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden sm:table-cell">
                Source
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
              <AdminTableCell colSpan={7} className="py-10 text-muted">
                No testimonials yet.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            rows.map((item) => {
              const open = isOpen(item.id);
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
                        <AdminTableCell className="hidden md:table-cell">
                          <p className="max-w-md truncate text-muted">
                            {item.quote}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell>{item.name}</AdminTableCell>
                        <AdminTableCell className="hidden sm:table-cell">
                          {item.source}
                        </AdminTableCell>
                        <AdminTableCell>
                          <StatusBadge
                            tone={item.published ? "success" : "neutral"}
                          >
                            {item.published ? "Published" : "Hidden"}
                          </StatusBadge>
                        </AdminTableCell>
                        <AdminTableCell>
                          <div className="flex justify-end gap-1.5">
                            <PreviewToggle
                              open={open}
                              onToggle={() => toggle(item.id)}
                            />
                            <EditLink href={`/admin/testimonials/${item.id}`} />
                            <DeleteButton
                              action={deleteTestimonialAction}
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
                        <TestimonialPreview
                          title={item.title}
                          quote={item.quote}
                          name={item.name}
                          source={item.source}
                        />
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
