"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import type { ProductCategory, RecommendedProduct } from "@/lib/db/schema";

export function RecommendedProductEditor({
  product,
  categories,
}: {
  product?: RecommendedProduct;
  categories: ProductCategory[];
}) {
  const router = useRouter();
  const id = product?.id ?? "new";
  const [category, setCategory] = useState(product?.category ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [referralLink, setReferralLink] = useState(
    product?.referralLink ?? "",
  );
  const [storeLogoUrl, setStoreLogoUrl] = useState(
    product?.storeLogoUrl ?? "/images/amazon.svg",
  );
  const [ctaLabel, setCtaLabel] = useState(
    product?.ctaLabel ?? "VIEW ON AMAZON",
  );
  const action = product
    ? updateRecommendedProductAction
    : createRecommendedProductAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  useEffect(() => {
    if (!product && state.success) {
      router.push("/admin/recommended-products");
      router.refresh();
    }
  }, [product, state.success, router]);

  const hasCategories = categories.length > 0;

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
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
        description="Referral link and store logo shown on the CTA."
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
        <ImageField
          label="Store logo"
          urlName="storeLogoUrl"
          uploadFolder="store-logos"
          value={storeLogoUrl}
          onChange={setStoreLogoUrl}
          required
        />
        <AdminField label="Button label" htmlFor={`cta-${id}`}>
          <Input
            id={`cta-${id}`}
            name="ctaLabel"
            variant="box"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            required
            placeholder="VIEW ON AMAZON"
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
        <Button type="submit" disabled={pending || !hasCategories}>
          {pending
            ? "Saving…"
            : product
              ? "Update product"
              : "Create product"}
        </Button>
      </div>
    </form>
  );
}
