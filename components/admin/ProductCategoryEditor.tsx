"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  createProductCategoryAction,
  updateProductCategoryAction,
} from "@/app/admin/actions/product-categories";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductCategory } from "@/lib/db/schema";

export function ProductCategoryEditor({
  category,
}: {
  category?: ProductCategory;
}) {
  const router = useRouter();
  const id = category?.id ?? "new";
  const [name, setName] = useState(category?.name ?? "");
  const action = category
    ? updateProductCategoryAction
    : createProductCategoryAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  useEffect(() => {
    if (!category && state.success) {
      router.push("/admin/product-categories");
      router.refresh();
    }
  }, [category, state.success, router]);

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <AdminSection
        title="Category"
        description="Filter pills on the supplements products section."
      >
        <AdminField label="Name" htmlFor={`name-${id}`}>
          <Input
            id={`name-${id}`}
            name="name"
            variant="box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Daily Wellness"
          />
        </AdminField>
      </AdminSection>

      <AdminSection title="Visibility" description="Control order and publishing.">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr]">
          <AdminField label="Sort order" htmlFor={`sort-${id}`}>
            <Input
              id={`sort-${id}`}
              name="sortOrder"
              variant="box"
              type="number"
              defaultValue={String(category?.sortOrder ?? 0)}
            />
          </AdminField>
          <AdminToggle
            name="published"
            label="Published"
            description="Show as a filter pill on the public page"
            defaultChecked={category?.published ?? true}
          />
        </div>
      </AdminSection>

      {state.error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="border border-brand/20 bg-brand-light/40 px-3 py-2 text-sm text-brand-dark">
          {state.success}
        </p>
      ) : null}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 border border-ink/10 bg-ivory/95 px-4 py-3 shadow-[0_-8px_24px_rgba(28,27,25,0.06)] backdrop-blur">
        <p className="text-xs text-muted">
          Renaming updates products that use this category.
        </p>
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : category
              ? "Update category"
              : "Create category"}
        </Button>
      </div>
    </form>
  );
}
