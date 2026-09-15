"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  createSupplementBrandAction,
  updateSupplementBrandAction,
} from "@/app/admin/actions/supplement-brands";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SupplementBrand } from "@/lib/db/schema";

export function SupplementBrandEditor({
  brand,
}: {
  brand?: SupplementBrand;
}) {
  const router = useRouter();
  const id = brand?.id ?? "new";
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl ?? "");
  const [title, setTitle] = useState(brand?.title ?? "");
  const [description, setDescription] = useState(brand?.description ?? "");
  const [discountText, setDiscountText] = useState(brand?.discountText ?? "");
  const [referralLink, setReferralLink] = useState(brand?.referralLink ?? "");
  const [ctaLabel, setCtaLabel] = useState(brand?.ctaLabel ?? "");
  const action = brand
    ? updateSupplementBrandAction
    : createSupplementBrandAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  useEffect(() => {
    if (!brand && state.success) {
      router.push("/admin/supplement-brands");
      router.refresh();
    }
  }, [brand, state.success, router]);

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      {brand ? <input type="hidden" name="id" value={brand.id} /> : null}

      <AdminSection
        title="Brand"
        description="Shown in the HBIC recommended supplements list."
      >
        <ImageField
          label="Logo"
          urlName="logoUrl"
          uploadFolder="supplement-brands"
          value={logoUrl}
          onChange={setLogoUrl}
          required={!brand}
        />
        <AdminField label="Title" htmlFor={`title-${id}`}>
          <Input
            id={`title-${id}`}
            name="title"
            variant="box"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="EVEXIAS Hormone Support"
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
        <AdminField
          label="Discount text"
          htmlFor={`discount-${id}`}
          hint="Optional. Example: 10% OFF with code HBIC10"
        >
          <Input
            id={`discount-${id}`}
            name="discountText"
            variant="box"
            value={discountText}
            onChange={(e) => setDiscountText(e.target.value)}
            placeholder="10% OFF with code HBIC10"
          />
        </AdminField>
      </AdminSection>

      <AdminSection title="Link" description="Where the visit button goes.">
        <AdminField label="Referral link" htmlFor={`link-${id}`}>
          <Input
            id={`link-${id}`}
            name="referralLink"
            variant="box"
            type="url"
            value={referralLink}
            onChange={(e) => setReferralLink(e.target.value)}
            required
            placeholder="https://"
          />
        </AdminField>
        <AdminField label="Button label" htmlFor={`cta-${id}`}>
          <Input
            id={`cta-${id}`}
            name="ctaLabel"
            variant="box"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            required
            placeholder="VISIT EVEXIAS"
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
              defaultValue={String(brand?.sortOrder ?? 0)}
            />
          </AdminField>
          <AdminToggle
            name="published"
            label="Published"
            description="Show on the supplements page"
            defaultChecked={brand?.published ?? true}
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
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : brand ? "Update brand" : "Create brand"}
        </Button>
      </div>
    </form>
  );
}
