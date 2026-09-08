"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

const schema = z.object({
  title: z.string().min(1),
  quote: z.string().min(1),
  name: z.string().min(1),
  source: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  published: z.boolean(),
});

export async function createTestimonialAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    title: formData.get("title"),
    quote: formData.get("quote"),
    name: formData.get("name"),
    source: formData.get("source"),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Check the testimonial fields." };

  await db.insert(testimonials).values(parsed.data);
  updateTag("testimonials");
  revalidatePath("/admin/testimonials");
  return { success: "Testimonial created." };
}

export async function updateTestimonialAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing testimonial id." };

  const parsed = schema.safeParse({
    title: formData.get("title"),
    quote: formData.get("quote"),
    name: formData.get("name"),
    source: formData.get("source"),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Check the testimonial fields." };

  await db
    .update(testimonials)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(testimonials.id, id));
  updateTag("testimonials");
  revalidatePath("/admin/testimonials");
  return { success: "Testimonial updated." };
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing testimonial id.");
  await db.delete(testimonials).where(eq(testimonials.id, id));
  updateTag("testimonials");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
}

export async function reorderTestimonialsAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(testimonials)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(testimonials.id, id)),
    ),
  );

  updateTag("testimonials");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
}
