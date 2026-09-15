"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  createStoreBrandAction,
  updateStoreBrandAction,
} from "@/app/admin/actions/store-brands";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StoreBrand } from "@/lib/db/schema";

export function StoreBrandEditor({ brand }: { brand?: StoreBrand }) {
  const router = useRouter();
  const id = brand?.id ?? "new";
  const [name, setName] = useState(brand?.name ?? "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl ?? "");
  const [ctaLabel, setCtaLabel] = useState(
    brand?.ctaLabel ?? "VIEW ON AMAZON",
  );
  const action = brand ? updateStoreBrandAction : createStoreBrandAction;
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  useEffect(() => {
    if (!brand && state.success) {
      router.push("/admin/store-brands");
      router.refresh();
    }
  }, [brand, state.success, router]);

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      {brand ? <input type="hidden" name="id" value={brand.id} /> : null}

      <AdminSection
        title="Store button"
        description="Reusable button style for product CTAs (logo + label)."
      >
        <AdminField label="Name" htmlFor={`name-${id}`}>
          <Input
            id={`name-${id}`}
            name="name"
            variant="box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Amazon"
          />
        </AdminField>
        <ImageField
          label="Logo"
          urlName="logoUrl"
          uploadFolder="store-logos"
          value={logoUrl}
          onChange={setLogoUrl}
          required={!brand}
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

      <AdminSection title="Visibility" description="Control order and availability.">
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
            description="Available when assigning products"
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
        <p className="text-xs text-muted">
          Changes apply to every product using this store button.
        </p>
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving…"
            : brand
              ? "Update store button"
              : "Create store button"}
        </Button>
      </div>
    </form>
  );
}
