"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { supplementBrands } from "@/lib/db/schema";

const schema = z.object({
  logoUrl: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  discountText: z.string().optional(),
  referralLink: z.string().url(),
  ctaLabel: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  published: z.boolean(),
});

function parseBrand(formData: FormData) {
  const discountRaw = String(formData.get("discountText") ?? "").trim();
  return schema.safeParse({
    logoUrl: formData.get("logoUrl"),
    title: formData.get("title"),
    description: formData.get("description"),
    discountText: discountRaw || undefined,
    referralLink: formData.get("referralLink"),
    ctaLabel: formData.get("ctaLabel"),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
}

function revalidateBrandPaths() {
  updateTag("supplement-brands");
  revalidatePath("/admin/supplement-brands");
  revalidatePath("/patient-resources/supplements");
  revalidatePath("/patient-resources");
}

export async function createSupplementBrandAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseBrand(formData);
  if (!parsed.success) return { error: "Check the brand fields." };

  await db.insert(supplementBrands).values({
    ...parsed.data,
    discountText: parsed.data.discountText ?? null,
  });
  revalidateBrandPaths();
  return { success: "Brand created." };
}

export async function updateSupplementBrandAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing brand id." };

  const parsed = parseBrand(formData);
  if (!parsed.success) return { error: "Check the brand fields." };

  await db
    .update(supplementBrands)
    .set({
      ...parsed.data,
      discountText: parsed.data.discountText ?? null,
      updatedAt: new Date(),
    })
    .where(eq(supplementBrands.id, id));
  revalidateBrandPaths();
  return { success: "Brand updated." };
}

export async function deleteSupplementBrandAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing brand id.");
  await db.delete(supplementBrands).where(eq(supplementBrands.id, id));
  revalidateBrandPaths();
}

export async function setSupplementBrandPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing brand id.");
  if (field !== "published") throw new Error("Invalid brand flag.");

  await db
    .update(supplementBrands)
    .set({ published: value, updatedAt: new Date() })
    .where(eq(supplementBrands.id, id));
  revalidateBrandPaths();
}

export async function reorderSupplementBrandsAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(supplementBrands)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(supplementBrands.id, id)),
    ),
  );

  revalidateBrandPaths();
}
