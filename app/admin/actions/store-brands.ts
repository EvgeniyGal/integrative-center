"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { recommendedProducts, storeBrands } from "@/lib/db/schema";

const schema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().min(1),
  ctaLabel: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  published: z.boolean(),
});

async function findStoreBrandById(id: string) {
  const rows = await db
    .select()
    .from(storeBrands)
    .where(eq(storeBrands.id, id))
    .limit(1);
  return rows[0] ?? null;
}

async function findStoreBrandByName(name: string) {
  const rows = await db
    .select()
    .from(storeBrands)
    .where(eq(storeBrands.name, name))
    .limit(1);
  return rows[0] ?? null;
}

function revalidateStoreBrandPaths() {
  updateTag("store-brands");
  updateTag("recommended-products");
  revalidatePath("/admin/store-brands");
  revalidatePath("/admin/recommended-products");
  revalidatePath("/patient-resources/supplements");
}

export async function createStoreBrandAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    logoUrl: formData.get("logoUrl"),
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim(),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Check the store button fields." };

  const existing = await findStoreBrandByName(parsed.data.name);
  if (existing) return { error: "A store button with that name already exists." };

  await db.insert(storeBrands).values(parsed.data);
  revalidateStoreBrandPaths();
  return { success: "Store button created." };
}

export async function updateStoreBrandAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing store button id." };

  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    logoUrl: formData.get("logoUrl"),
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim(),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Check the store button fields." };

  const current = await findStoreBrandById(id);
  if (!current) return { error: "Store button not found." };

  const duplicate = await findStoreBrandByName(parsed.data.name);
  if (duplicate && duplicate.id !== id) {
    return { error: "A store button with that name already exists." };
  }

  await db
    .update(storeBrands)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(storeBrands.id, id));
  revalidateStoreBrandPaths();
  return { success: "Store button updated." };
}

export async function deleteStoreBrandAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing store button id.");

  const current = await findStoreBrandById(id);
  if (!current) throw new Error("Store button not found.");

  const inUse = await db
    .select({ id: recommendedProducts.id })
    .from(recommendedProducts)
    .where(eq(recommendedProducts.storeBrandId, id))
    .limit(1);
  if (inUse.length > 0) {
    throw new Error(
      "Cannot delete a store button that is assigned to products. Reassign those products first.",
    );
  }

  await db.delete(storeBrands).where(eq(storeBrands.id, id));
  revalidateStoreBrandPaths();
}

export async function setStoreBrandPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing store button id.");
  if (field !== "published") throw new Error("Invalid store button flag.");

  await db
    .update(storeBrands)
    .set({ published: value, updatedAt: new Date() })
    .where(eq(storeBrands.id, id));
  revalidateStoreBrandPaths();
}

export async function reorderStoreBrandsAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(storeBrands)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(storeBrands.id, id)),
    ),
  );

  revalidateStoreBrandPaths();
}
