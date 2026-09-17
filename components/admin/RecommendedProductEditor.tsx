"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { generateProductDraftAction } from "@/app/admin/actions/ai";
import type { ActionState } from "@/app/admin/actions/auth";
import {
  createRecommendedProductAction,
  updateRecommendedProductAction,
} from "@/app/admin/actions/recommended-products";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  ProductCategory,
  RecommendedProduct,
  StoreBrand,
} from "@/lib/db/schema";

export function RecommendedProductEditor({
  product,
  categories,
  storeBrands,
}: {
  product?: RecommendedProduct;
  categories: ProductCategory[];
  storeBrands: StoreBrand[];
}) {
  const router = useRouter();
  const id = product?.id ?? "new";
  const [category, setCategory] = useState(product?.category ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [notes, setNotes] = useState("");
  const [referralLink, setReferralLink] = useState(
    product?.referralLink ?? "",
  );
  const [storeBrandId, setStoreBrandId] = useState(
    product?.storeBrandId ?? "",
  );
  const action = product
    ? updateRecommendedProductAction
    : createRecommendedProductAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);
  const [aiState, aiAction, aiPending] = useActionState(
    generateProductDraftAction,
    {} as ActionState & { draft?: { title: string; description: string } },
  );

  useEffect(() => {
    if (aiState.draft) {
      setTitle(aiState.draft.title);
      setDescription(aiState.draft.description);
    }
  }, [aiState.draft]);

  useEffect(() => {
    if (!product && state.success) {
      router.push("/admin/recommended-products");
      router.refresh();
    }
  }, [product, state.success, router]);

  const hasCategories = categories.length > 0;
  const hasStoreBrands = storeBrands.length > 0;
  const selectedStore = useMemo(
    () => storeBrands.find((item) => item.id === storeBrandId) ?? null,
    [storeBrandId, storeBrands],
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {!product ? (
        <form
          action={aiAction}
          className="space-y-4 border border-dashed border-brand/35 bg-brand-light/25 p-5"
        >
          <div className="space-y-1">
            <h3 className="font-display text-xl text-ink">AI draft assist</h3>
            <p className="text-sm text-muted">
              Provide notes. The draft fills the title and description —
              review before saving.
            </p>
          </div>
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="category" value={category} />
          <AdminField label="Notes" htmlFor={`notes-${id}`}>
            <Textarea
              id={`notes-${id}`}
              name="notes"
              variant="box"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What this product is, who it is for…"
            />
          </AdminField>
          {aiState.error ? (
            <p className="text-sm text-red-700">{aiState.error}</p>
          ) : null}
          {aiState.success ? (
            <p className="text-sm text-brand-dark">{aiState.success}</p>
          ) : null}
          <Button type="submit" variant="outline" size="sm" disabled={aiPending}>
            {aiPending ? "Generating…" : "Generate draft"}
          </Button>
        </form>
      ) : null}

      <form action={formAction} className="space-y-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <AdminSection
        title="Product"
        description="Shown in the recommended products grid."
      >
        <AdminField
          label="Category"
          htmlFor={`category-${id}`}
          hint="Managed under Categories in the admin menu."
        >
          {hasCategories ? (
            <Select
              id={`category-${id}`}
              name="category"
              variant="box"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                  {!item.published ? " (hidden)" : ""}
                </option>
              ))}
            </Select>
          ) : (
            <div className="space-y-2">
              <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                No categories yet. Create one before adding products.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-none">
                <Link href="/admin/product-categories/new">Add category</Link>
              </Button>
            </div>
          )}
        </AdminField>
        <ImageField
          label="Product image"
          urlName="imageUrl"
          uploadFolder="recommended-products"
          value={imageUrl}
          onChange={setImageUrl}
          required={!product}
        />
        <AdminField label="Title" htmlFor={`title-${id}`}>
          <Input
            id={`title-${id}`}
            name="title"
            variant="box"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Magnesium Glycinate"
          />
        </AdminField>
        <AdminField label="Description" htmlFor={`description-${id}`}>
          <Textarea
            id={`description-${id}`}
            name="description"
            variant="box"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
          />
        </AdminField>
      </AdminSection>

      <AdminSection
        title="Store button"
        description="Pick a shared store style. Manage logos under Store buttons."
      >
        <AdminField label="Referral link" htmlFor={`link-${id}`}>
          <Input
            id={`link-${id}`}
            name="referralLink"
            variant="box"
            type="url"
            value={referralLink}
            onChange={(e) => setReferralLink(e.target.value)}
            required
            placeholder="https://www.amazon.com/"
          />
        </AdminField>
        <AdminField
          label="Store button"
          htmlFor={`store-${id}`}
          hint="One logo/label is reused across many products."
        >
          {hasStoreBrands ? (
            <div className="space-y-3">
              <Select
                id={`store-${id}`}
                name="storeBrandId"
                variant="box"
                value={storeBrandId}
                onChange={(e) => setStoreBrandId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a store button
                </option>
                {storeBrands.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {!item.published ? " (hidden)" : ""}
                  </option>
                ))}
              </Select>
              {selectedStore ? (
                <div className="flex items-center gap-3 border border-ink/10 bg-ivory px-3 py-2.5">
                  <div className="relative h-6 w-16 shrink-0">
                    <Image
                      src={selectedStore.logoUrl}
                      alt=""
                      fill
                      className="object-contain object-left"
                      sizes="64px"
                    />
                  </div>
                  <p className="text-sm text-ink">{selectedStore.ctaLabel}</p>
                </div>
              ) : null}
              <p className="text-xs text-muted">
                Need another store?{" "}
                <Link
                  href="/admin/store-brands/new"
                  className="text-brand hover:underline"
                >
                  Add store button
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                No store buttons yet. Create Amazon (or another store) first.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-none">
                <Link href="/admin/store-brands/new">Add store button</Link>
              </Button>
            </div>
          )}
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
              defaultValue={String(product?.sortOrder ?? 0)}
            />
          </AdminField>
          <AdminToggle
            name="published"
            label="Published"
            description="Show on the supplements page"
            defaultChecked={product?.published ?? true}
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
        <p className="text-xs text-muted">Changes apply after you save.</p>
        <Button
          type="submit"
          disabled={pending || !hasCategories || !hasStoreBrands}
        >
          {pending
            ? "Saving…"
            : product
              ? "Update product"
              : "Create product"}
        </Button>
      </div>
    </form>
    </div>
  );
}
