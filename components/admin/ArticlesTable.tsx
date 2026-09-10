"use client";

import { Fragment } from "react";
import Image from "next/image";

import {
  deleteArticleAction,
  setArticleFlagAction,
} from "@/app/admin/actions/articles";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  StatusToggle,
} from "@/components/admin/AdminTable";
import {
  ArticleDetailPreview,
  ArticleHomePreview,
} from "@/components/admin/ContentPreviews";
import {
  DeleteButton,
  EditLink,
  PreviewToggle,
  usePreviewId,
} from "@/components/admin/TableActions";
import type { Article } from "@/lib/db/schema";

export function ArticlesTable({ items }: { items: Article[] }) {
  const { toggle, isOpen } = usePreviewId();

  return (
    <AdminTable>
      <AdminTableElement>
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell className="w-16">Cover</AdminTableHeaderCell>
            <AdminTableHeaderCell>Article</AdminTableHeaderCell>
            <AdminTableHeaderCell className="hidden md:table-cell">
              Category
            </AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell className="hidden lg:table-cell">
              Home
            </AdminTableHeaderCell>
            <AdminTableHeaderCell className="hidden xl:table-cell">
              Updated
            </AdminTableHeaderCell>
            <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {items.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={7} className="py-10 text-muted">
                No articles yet.
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            items.map((item) => {
              const open = isOpen(item.id);
              const isPublished = item.status === "published";
              return (
                <Fragment key={item.id}>
                  <AdminTableRow selected={open}>
                    <AdminTableCell>
                      <div className="relative size-12 overflow-hidden bg-stone">
                        {item.coverImageUrl ? (
                          <Image
                            src={item.coverImageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : null}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="max-w-sm font-medium text-ink">{item.title}</p>
                      <p className="mt-1 text-xs text-muted">/news/{item.slug}</p>
                    </AdminTableCell>
                    <AdminTableCell className="hidden md:table-cell">
                      {item.category}
                    </AdminTableCell>
                    <AdminTableCell>
                      <StatusToggle
                        action={setArticleFlagAction}
                        id={item.id}
                        field="status"
                        value={isPublished}
                        onLabel="Published"
                        offLabel={
                          item.status === "archived" ? "Archived" : "Draft"
                        }
                        onTone="success"
                        offTone={
                          item.status === "archived" ? "neutral" : "warning"
                        }
                      />
                    </AdminTableCell>
                    <AdminTableCell className="hidden lg:table-cell">
                      <StatusToggle
                        action={setArticleFlagAction}
                        id={item.id}
                        field="featuredOnHome"
                        value={item.featuredOnHome}
                        onLabel="Featured"
                        offLabel="Not featured"
                        onTone="info"
                        offTone="neutral"
                      />
                    </AdminTableCell>
                    <AdminTableCell className="hidden xl:table-cell text-muted">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="flex justify-end gap-1.5">
                        <PreviewToggle open={open} onToggle={() => toggle(item.id)} />
                        <EditLink href={`/admin/news/${item.id}`} />
                        <DeleteButton action={deleteArticleAction} id={item.id} />
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                  {open ? (
                    <tr className="bg-stone/15">
                      <td colSpan={7} className="px-5 py-5">
                        <div className="grid gap-5 xl:grid-cols-2">
                          <ArticleHomePreview
                            title={item.title}
                            excerpt={item.excerpt}
                            category={item.category}
                            coverImageUrl={item.coverImageUrl}
                          />
                          <ArticleDetailPreview
                            title={item.title}
                            excerpt={item.excerpt}
                            category={item.category}
                            coverImageUrl={item.coverImageUrl}
                            blocks={item.blocks ?? []}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </AdminTableBody>
      </AdminTableElement>
    </AdminTable>
  );
}
