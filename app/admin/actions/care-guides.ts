"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { careGuides } from "@/lib/db/schema";
import {
  collectCareGuideBlobUrls,
  deleteOrphanBlobUrls,
} from "@/lib/media/blob";

const schema = z
  .object({
    imageUrl: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    ctaLabel: z.string().min(1),
    actionType: z.enum(["link", "pdf"]),
    linkUrl: z.string().optional(),
    pdfUrl: z.string().optional(),
    pdfFileName: z.string().optional(),
    sortOrder: z.coerce.number().int(),
    published: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.actionType === "link") {
      const url = data.linkUrl?.trim() ?? "";
      if (!url) {
        ctx.addIssue({
          code: "custom",
          message: "Link URL is required.",
          path: ["linkUrl"],
        });
      } else {
        try {
          new URL(url);
        } catch {
          ctx.addIssue({
            code: "custom",
            message: "Enter a valid URL.",
            path: ["linkUrl"],
          });
        }
      }
    }
    if (data.actionType === "pdf") {
      if (!data.pdfUrl?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Upload a PDF.",
          path: ["pdfUrl"],
        });
      }
      if (!data.pdfFileName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "PDF file name is required.",
          path: ["pdfFileName"],
        });
      }
    }
  });

function parseGuide(formData: FormData) {
  const actionType = String(formData.get("actionType") ?? "link");
  return schema.safeParse({
    imageUrl: formData.get("imageUrl"),
    title: formData.get("title"),
    description: formData.get("description"),
    ctaLabel: formData.get("ctaLabel"),
    actionType,
    linkUrl: String(formData.get("linkUrl") ?? "").trim() || undefined,
    pdfUrl: String(formData.get("pdfUrl") ?? "").trim() || undefined,
    pdfFileName: String(formData.get("pdfFileName") ?? "").trim() || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
}

function toRow(data: z.infer<typeof schema>) {
  if (data.actionType === "link") {
    return {
      imageUrl: data.imageUrl,
      title: data.title,
      description: data.description,
      ctaLabel: data.ctaLabel,
      actionType: "link" as const,
      linkUrl: data.linkUrl!.trim(),
      pdfUrl: null,
      pdfFileName: null,
      sortOrder: data.sortOrder,
      published: data.published,
    };
  }
  return {
    imageUrl: data.imageUrl,
    title: data.title,
    description: data.description,
    ctaLabel: data.ctaLabel,
    actionType: "pdf" as const,
    linkUrl: null,
    pdfUrl: data.pdfUrl!.trim(),
    pdfFileName: data.pdfFileName!.trim(),
    sortOrder: data.sortOrder,
    published: data.published,
  };
}

function revalidateGuidePaths() {
  updateTag("care-guides");
  revalidatePath("/admin/care-guides");
  revalidatePath("/patient-resources");
}

export async function createCareGuideAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseGuide(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the guide fields." };
  }
  if (!parsed.data.imageUrl || parsed.data.imageUrl.startsWith("blob:")) {
    return { error: "Add an image before saving." };
  }

  await db.insert(careGuides).values(toRow(parsed.data));
  revalidateGuidePaths();
  return { success: "Care guide created." };
}

export async function updateCareGuideAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing guide id." };

  const existing = await db.query.careGuides.findFirst({
    where: eq(careGuides.id, id),
  });
  if (!existing) return { error: "Guide not found." };

  const parsed = parseGuide(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the guide fields." };
  }
  if (!parsed.data.imageUrl || parsed.data.imageUrl.startsWith("blob:")) {
    return { error: "Add an image before saving." };
  }

  const previousUrls = collectCareGuideBlobUrls(existing);
  const next = toRow(parsed.data);

  await db
    .update(careGuides)
    .set({ ...next, updatedAt: new Date() })
    .where(eq(careGuides.id, id));

  const nextUrls = new Set(collectCareGuideBlobUrls(next));
  const removed = previousUrls.filter((url) => !nextUrls.has(url));
  await deleteOrphanBlobUrls(removed, { careGuideId: id });

  revalidateGuidePaths();
  return { success: "Care guide updated." };
}

export async function deleteCareGuideAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing guide id.");

  const existing = await db.query.careGuides.findFirst({
    where: eq(careGuides.id, id),
  });
  if (!existing) throw new Error("Guide not found.");

  const urls = collectCareGuideBlobUrls(existing);
  await db.delete(careGuides).where(eq(careGuides.id, id));
  await deleteOrphanBlobUrls(urls, { careGuideId: id });

  revalidateGuidePaths();
}

export async function setCareGuidePublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing guide id.");
  if (field !== "published") throw new Error("Invalid guide flag.");

  await db
    .update(careGuides)
    .set({ published: value, updatedAt: new Date() })
    .where(eq(careGuides.id, id));
  revalidateGuidePaths();
}

export async function reorderCareGuidesAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(careGuides)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(careGuides.id, id)),
    ),
  );

  revalidateGuidePaths();
}
