"use client";

import { Fragment } from "react";

import {
  deleteQuestionAction,
  reorderQuestionsAction,
} from "@/app/admin/actions/questions";
import {
  AdminTable,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  StatusBadge,
} from "@/components/admin/AdminTable";
import { QuestionHomePreview } from "@/components/admin/ContentPreviews";
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
import type { Question } from "@/lib/db/schema";

export function QuestionsTable({ items }: { items: Question[] }) {
  const { toggle, isOpen } = usePreviewId();
  const { rows, handleDragEnd } = useSortableRows(items, reorderQuestionsAction);
  const published = rows
    .filter((item) => item.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SortableTableRoot
      id="admin-questions"
      ids={rows.map((item) => item.id)}
      onDragEnd={handleDragEnd}
    >
      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell className="w-16">#</AdminTableHeaderCell>
              <AdminTableHeaderCell>Question</AdminTableHeaderCell>
              <AdminTableHeaderCell className="hidden md:table-cell">
                Answer
              </AdminTableHeaderCell>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">
                Actions
              </AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <SortableTableBody>
          {rows.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={6} className="py-10 text-muted">
                No questions yet. Create the first one.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            rows.map((item) => {
              const displayNumber =
                published.findIndex((q) => q.id === item.id) + 1;
              const numberLabel = item.published
                ? String(displayNumber > 0 ? displayNumber : "—")
                : "—";
              const open = isOpen(item.id);

              return (
                <Fragment key={item.id}>
                  <SortableAdminTableRow id={item.id} selected={open}>
                    {({ attributes, listeners }) => (
                      <>
                        <AdminTableCell className="font-display text-lg text-brand">
                          {numberLabel}
                        </AdminTableCell>
                        <AdminTableCell>
                          <p className="max-w-xs font-medium text-ink">
                            {item.question}
                          </p>
                        </AdminTableCell>
                        <AdminTableCell className="hidden md:table-cell">
                          <p className="max-w-md truncate text-muted">
                            {item.answer}
                          </p>
                        </AdminTableCell>
                        <OrderDragCell
                          order={item.sortOrder}
                          attributes={attributes}
                          listeners={listeners}
                        />
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
                            <EditLink href={`/admin/questions/${item.id}`} />
                            <DeleteButton
                              action={deleteQuestionAction}
                              id={item.id}
                            />
                          </div>
                        </AdminTableCell>
                      </>
                    )}
                  </SortableAdminTableRow>
                  {open ? (
                    <tr className="bg-stone/15">
                      <td colSpan={6} className="px-5 py-5">
                        <QuestionHomePreview
                          number={numberLabel === "—" ? "1" : numberLabel}
                          question={item.question}
                          answer={item.answer}
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
