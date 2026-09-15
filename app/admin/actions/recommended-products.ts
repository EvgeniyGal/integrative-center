"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { productCategories, recommendedProducts } from "@/lib/db/schema";

const schema = z.object({
  category: z.string().min(1),
  imageUrl: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  referralLink: z.string().url(),
  storeLogoUrl: z.string().min(1),
  ctaLabel: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  published: z.boolean(),
});

function parseProduct(formData: FormData) {
  return schema.safeParse({
    category: String(formData.get("category") ?? "").trim(),
    imageUrl: formData.get("imageUrl"),
    title: formData.get("title"),
    description: formData.get("description"),
    referralLink: formData.get("referralLink"),
    storeLogoUrl: formData.get("storeLogoUrl"),
    ctaLabel: formData.get("ctaLabel"),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
}

async function assertKnownCategory(name: string) {
  const rows = await db
    .select({ id: productCategories.id })
    .from(productCategories)
    .where(eq(productCategories.name, name))
    .limit(1);
  return rows.length > 0;
}

function revalidateProductPaths() {
  updateTag("recommended-products");
  revalidatePath("/admin/recommended-products");
  revalidatePath("/patient-resources/supplements");
  revalidatePath("/patient-resources");
}

export async function createRecommendedProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseProduct(formData);
  if (!parsed.success) return { error: "Check the product fields." };
  if (!(await assertKnownCategory(parsed.data.category))) {
    return { error: "Choose a category from the list." };
  }

  await db.insert(recommendedProducts).values(parsed.data);
  revalidateProductPaths();
  return { success: "Product created." };
}

export async function updateRecommendedProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing product id." };

  const parsed = parseProduct(formData);
  if (!parsed.success) return { error: "Check the product fields." };
  if (!(await assertKnownCategory(parsed.data.category))) {
    return { error: "Choose a category from the list." };
  }

  await db
    .update(recommendedProducts)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(recommendedProducts.id, id));
  revalidateProductPaths();
  return { success: "Product updated." };
}

export async function deleteRecommendedProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing product id.");
  await db.delete(recommendedProducts).where(eq(recommendedProducts.id, id));
  revalidateProductPaths();
}

export async function setRecommendedProductPublishedAction(
  formData: FormData,
) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing product id.");
  if (field !== "published") throw new Error("Invalid product flag.");

  await db
    .update(recommendedProducts)
    .set({ published: value, updatedAt: new Date() })
    .where(eq(recommendedProducts.id, id));
  revalidateProductPaths();
}

export async function reorderRecommendedProductsAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(recommendedProducts)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(recommendedProducts.id, id)),
    ),
  );

  revalidateProductPaths();
}
