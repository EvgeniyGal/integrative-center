"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { productCategories, recommendedProducts } from "@/lib/db/schema";

const schema = z.object({
  name: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  published: z.boolean(),
});

async function findCategoryById(id: string) {
  const rows = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.id, id))
    .limit(1);
  return rows[0] ?? null;
}

async function findCategoryByName(name: string) {
  const rows = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.name, name))
    .limit(1);
  return rows[0] ?? null;
}

function revalidateCategoryPaths() {
  updateTag("product-categories");
  updateTag("recommended-products");
  revalidatePath("/admin/product-categories");
  revalidatePath("/admin/recommended-products");
  revalidatePath("/patient-resources/supplements");
}

export async function createProductCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Check the category fields." };

  const existing = await findCategoryByName(parsed.data.name);
  if (existing) return { error: "A category with that name already exists." };

  await db.insert(productCategories).values(parsed.data);
  revalidateCategoryPaths();
  return { success: "Category created." };
}

export async function updateProductCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing category id." };

  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Check the category fields." };

  const current = await findCategoryById(id);
  if (!current) return { error: "Category not found." };

  const duplicate = await findCategoryByName(parsed.data.name);
  if (duplicate && duplicate.id !== id) {
    return { error: "A category with that name already exists." };
  }

  await db
    .update(productCategories)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(productCategories.id, id));

  if (current.name !== parsed.data.name) {
    await db
      .update(recommendedProducts)
      .set({ category: parsed.data.name, updatedAt: new Date() })
      .where(eq(recommendedProducts.category, current.name));
  }

  revalidateCategoryPaths();
  return { success: "Category updated." };
}

export async function deleteProductCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing category id.");

  const current = await findCategoryById(id);
  if (!current) throw new Error("Category not found.");

  const inUse = await db
    .select({ id: recommendedProducts.id })
    .from(recommendedProducts)
    .where(eq(recommendedProducts.category, current.name))
    .limit(1);
  if (inUse.length > 0) {
    throw new Error(
      "Cannot delete a category that is assigned to products. Reassign those products first.",
    );
  }

  await db.delete(productCategories).where(eq(productCategories.id, id));
  revalidateCategoryPaths();
}

export async function setProductCategoryPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing category id.");
  if (field !== "published") throw new Error("Invalid category flag.");

  await db
    .update(productCategories)
    .set({ published: value, updatedAt: new Date() })
    .where(eq(productCategories.id, id));
  revalidateCategoryPaths();
}

export async function reorderProductCategoriesAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(productCategories)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(productCategories.id, id)),
    ),
  );

  revalidateCategoryPaths();
}
