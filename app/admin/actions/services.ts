"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  summary: z.string().min(1),
  body: z.array(z.string()),
  imageUrl: z.string().min(1),
  showOnHome: z.boolean(),
  visible: z.boolean(),
  sortOrder: z.number().int(),
});

async function maybeUploadImage(file: File | null, fallback: string) {
  if (!file || file.size === 0) return fallback;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  const blob = await put(`services/${Date.now()}-${file.name}`, file, {
    access: "public",
  });
  return blob.url;
}

function parseServiceForm(formData: FormData, existingImage = "") {
  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  const bodyRaw = String(formData.get("body") ?? "");
  return serviceSchema.safeParse({
    slug: slugify(slugInput || title),
    title,
    eyebrow: String(formData.get("eyebrow") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    body: bodyRaw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    imageUrl: String(formData.get("imageUrl") ?? existingImage),
    showOnHome: formData.get("showOnHome") === "on",
    visible: formData.get("visible") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  });
}

export async function createServiceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  try {
    const file = formData.get("image") as File | null;
    const imageUrl = await maybeUploadImage(file, String(formData.get("imageUrl") ?? ""));
    formData.set("imageUrl", imageUrl);
    const parsed = parseServiceForm(formData);
    if (!parsed.success) return { error: "Check the service fields and image." };

    await db.insert(services).values(parsed.data);
    updateTag("services");
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/");
    return { success: "Service created." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not create service.",
    };
  }
}

export async function updateServiceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing service id." };

  try {
    const existing = await db.query.services.findFirst({
      where: eq(services.id, id),
    });
    if (!existing) return { error: "Service not found." };

    const file = formData.get("image") as File | null;
    const imageUrl = await maybeUploadImage(file, existing.imageUrl);
    formData.set("imageUrl", imageUrl);
    const parsed = parseServiceForm(formData, existing.imageUrl);
    if (!parsed.success) return { error: "Check the service fields." };

    await db
      .update(services)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(services.id, id));
    updateTag("services");
    updateTag(`service:${parsed.data.slug}`);
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/");
    return { success: "Service updated." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not update service.",
    };
  }
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing service id.");
  await db.delete(services).where(eq(services.id, id));
  updateTag("services");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function setServiceFlagAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing service id.");
  if (field !== "showOnHome" && field !== "visible") {
    throw new Error("Invalid service flag.");
  }

  const existing = await db.query.services.findFirst({
    where: eq(services.id, id),
  });
  if (!existing) throw new Error("Service not found.");

  await db
    .update(services)
    .set({ [field]: value, updatedAt: new Date() })
    .where(eq(services.id, id));

  updateTag("services");
  updateTag(`service:${existing.slug}`);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function reorderServicesAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(services)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(services.id, id)),
    ),
  );

  updateTag("services");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}
