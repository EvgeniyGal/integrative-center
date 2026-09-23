"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import type { ArticleBlock } from "@/lib/content/blocks";
import { safeParseMarkdown } from "@/lib/content/markdown";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import {
  collectServiceImageUrls,
  deleteOrphanBlobUrls,
} from "@/lib/media/blob";
import { uploadImageAsWebp } from "@/lib/media/upload";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function isServiceSlugTaken(slug: string, exceptId?: string) {
  const existing = await db.query.services.findFirst({
    where: exceptId
      ? and(eq(services.slug, slug), ne(services.id, exceptId))
      : eq(services.slug, slug),
    columns: { id: true },
  });
  return Boolean(existing);
}

function slugTakenMessage(slug: string) {
  return `Slug “${slug}” is already in use. Choose a different slug.`;
}

const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  summary: z.string().min(1),
  body: z.array(z.custom<ArticleBlock>()),
  imageUrl: z.string().min(1),
  showOnHome: z.boolean(),
  visible: z.boolean(),
  sortOrder: z.number().int(),
});

export type ServiceActionState = ActionState & {
  /** Persisted Blob URL returned after upload so retries keep the image. */
  imageUrl?: string;
};

function resolveBlocksFromForm(
  formData: FormData,
): { ok: true; blocks: ArticleBlock[] } | { ok: false; error: string } {
  const bodyMarkdown = String(formData.get("bodyMarkdown") ?? "");
  if (bodyMarkdown.trim()) {
    const parsed = safeParseMarkdown(bodyMarkdown);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }
    return { ok: true, blocks: parsed.blocks };
  }

  const rawBlocks = String(formData.get("blocks") ?? "");
  if (rawBlocks.trim()) {
    try {
      const blocks = JSON.parse(rawBlocks) as ArticleBlock[];
      if (Array.isArray(blocks)) return { ok: true, blocks };
    } catch {
      return { ok: false, error: "Body blocks are invalid." };
    }
  }

  return { ok: true, blocks: [] };
}

async function resolveServiceImage(
  file: File | null,
  formUrl: string,
  existingUrl: string,
) {
  if (file && file.size > 0) {
    return uploadImageAsWebp(file, "services");
  }
  if (formUrl.startsWith("blob:")) {
    return existingUrl;
  }
  return formUrl || existingUrl;
}

function parseServiceForm(
  formData: FormData,
  blocks: ArticleBlock[],
  existingImage = "",
) {
  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  return serviceSchema.safeParse({
    slug: slugify(slugInput || title),
    title,
    eyebrow: String(formData.get("eyebrow") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    body: blocks,
    imageUrl: String(formData.get("imageUrl") ?? existingImage),
    showOnHome: formData.get("showOnHome") === "on",
    visible: formData.get("visible") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  });
}

function readServiceSlug(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  return slugify(slugInput || title);
}

export async function createServiceAction(
  _prev: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  await requireAdmin();
  let uploadedImageUrl = "";
  try {
    const slug = readServiceSlug(formData);
    if (!slug) {
      return { error: "Add a title or slug before saving." };
    }

    const file = formData.get("image");
    const formUrl = String(formData.get("imageUrl") ?? "");
    uploadedImageUrl = await resolveServiceImage(
      file instanceof File ? file : null,
      formUrl,
      "",
    );
    const persistImage = uploadedImageUrl
      ? { imageUrl: uploadedImageUrl }
      : {};

    if (await isServiceSlugTaken(slug)) {
      return { error: slugTakenMessage(slug), ...persistImage };
    }

    if (!uploadedImageUrl) {
      return { error: "Add a service image before saving." };
    }
    formData.set("imageUrl", uploadedImageUrl);

    const blocksResult = resolveBlocksFromForm(formData);
    if (!blocksResult.ok) {
      return { error: blocksResult.error, ...persistImage };
    }

    const parsed = parseServiceForm(formData, blocksResult.blocks);
    if (!parsed.success) {
      return {
        error: "Check the service fields and image.",
        ...persistImage,
      };
    }

    await db.insert(services).values(parsed.data);
    updateTag("services");
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath(`/services/${parsed.data.slug}`);
    revalidatePath("/");
    return { success: "Service created." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create service.";
    if (/unique|duplicate/i.test(message)) {
      return {
        error: "That slug is already in use. Choose a different slug.",
        ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {}),
      };
    }
    return {
      error: message,
      ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {}),
    };
  }
}

export async function updateServiceAction(
  _prev: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing service id." };

  let uploadedImageUrl = "";
  try {
    const existing = await db.query.services.findFirst({
      where: eq(services.id, id),
    });
    if (!existing) return { error: "Service not found." };

    const slug = readServiceSlug(formData);
    if (!slug) {
      return { error: "Add a title or slug before saving." };
    }

    const previousUrls = collectServiceImageUrls(existing);
    const file = formData.get("image");
    const formUrl = String(formData.get("imageUrl") ?? "");
    uploadedImageUrl = await resolveServiceImage(
      file instanceof File ? file : null,
      formUrl,
      existing.imageUrl,
    );
    const persistImage = uploadedImageUrl
      ? { imageUrl: uploadedImageUrl }
      : {};

    if (await isServiceSlugTaken(slug, id)) {
      return { error: slugTakenMessage(slug), ...persistImage };
    }

    if (!uploadedImageUrl) {
      return { error: "Add a service image before saving." };
    }
    formData.set("imageUrl", uploadedImageUrl);

    const blocksResult = resolveBlocksFromForm(formData);
    if (!blocksResult.ok) {
      return { error: blocksResult.error, ...persistImage };
    }

    const parsed = parseServiceForm(
      formData,
      blocksResult.blocks,
      existing.imageUrl,
    );
    if (!parsed.success) {
      return {
        error: "Check the service fields.",
        ...persistImage,
      };
    }

    await db
      .update(services)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(services.id, id));

    const nextUrls = new Set(collectServiceImageUrls(parsed.data));
    const removed = previousUrls.filter((url) => !nextUrls.has(url));
    await deleteOrphanBlobUrls(removed, { serviceId: id });

    updateTag("services");
    updateTag(`service:${parsed.data.slug}`);
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath(`/services/${parsed.data.slug}`);
    if (existing.slug !== parsed.data.slug) {
      revalidatePath(`/services/${existing.slug}`);
    }
    revalidatePath("/");
    return { success: "Service updated." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update service.";
    if (/unique|duplicate/i.test(message)) {
      return {
        error: "That slug is already in use. Choose a different slug.",
        ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {}),
      };
    }
    return {
      error: message,
      ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {}),
    };
  }
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing service id.");

  const existing = await db.query.services.findFirst({
    where: eq(services.id, id),
  });
  if (!existing) throw new Error("Service not found.");

  const urls = collectServiceImageUrls(existing);

  await db.delete(services).where(eq(services.id, id));
  await deleteOrphanBlobUrls(urls, { serviceId: id });

  updateTag("services");
  updateTag(`service:${existing.slug}`);
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
