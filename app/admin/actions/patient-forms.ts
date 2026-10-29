"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { patientForms } from "@/lib/db/schema";
import {
  collectPatientFormBlobUrls,
  deleteOrphanBlobUrls,
} from "@/lib/media/blob";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  pdfUrl: z.string().min(1),
  pdfFileName: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  published: z.boolean(),
});

function parseForm(formData: FormData) {
  return schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    pdfUrl: String(formData.get("pdfUrl") ?? "").trim(),
    pdfFileName: String(formData.get("pdfFileName") ?? "").trim(),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
}

function toRow(data: z.infer<typeof schema>) {
  return {
    title: data.title.trim(),
    description: data.description.trim(),
    pdfUrl: data.pdfUrl.trim(),
    pdfFileName: data.pdfFileName.trim(),
    sortOrder: data.sortOrder,
    published: data.published,
  };
}

function revalidateFormPaths() {
  updateTag("patient-forms");
  revalidatePath("/admin/patient-forms");
  revalidatePath("/patient-resources/forms");
  revalidatePath("/patient-resources");
}

export async function createPatientFormAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form fields." };
  }
  if (!parsed.data.pdfUrl || parsed.data.pdfUrl.startsWith("blob:")) {
    return { error: "Upload a PDF before saving." };
  }

  await db.insert(patientForms).values(toRow(parsed.data));
  revalidateFormPaths();
  return { success: "Patient form created." };
}

export async function updatePatientFormAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing form id." };

  const existing = await db.query.patientForms.findFirst({
    where: eq(patientForms.id, id),
  });
  if (!existing) return { error: "Form not found." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form fields." };
  }
  if (!parsed.data.pdfUrl || parsed.data.pdfUrl.startsWith("blob:")) {
    return { error: "Upload a PDF before saving." };
  }

  const previousUrls = collectPatientFormBlobUrls(existing);
  const next = toRow(parsed.data);

  await db
    .update(patientForms)
    .set({ ...next, updatedAt: new Date() })
    .where(eq(patientForms.id, id));

  const nextUrls = new Set(collectPatientFormBlobUrls(next));
  const removed = previousUrls.filter((url) => !nextUrls.has(url));
  await deleteOrphanBlobUrls(removed, { patientFormId: id });

  revalidateFormPaths();
  return { success: "Patient form updated." };
}

export async function deletePatientFormAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing form id.");

  const existing = await db.query.patientForms.findFirst({
    where: eq(patientForms.id, id),
  });
  if (!existing) throw new Error("Form not found.");

  const urls = collectPatientFormBlobUrls(existing);
  await db.delete(patientForms).where(eq(patientForms.id, id));
  await deleteOrphanBlobUrls(urls, { patientFormId: id });

  revalidateFormPaths();
}

export async function setPatientFormPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing form id.");
  if (field !== "published") throw new Error("Invalid form flag.");

  await db
    .update(patientForms)
    .set({ published: value, updatedAt: new Date() })
    .where(eq(patientForms.id, id));
  revalidateFormPaths();
}

export async function reorderPatientFormsAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(patientForms)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(patientForms.id, id)),
    ),
  );

  revalidateFormPaths();
}
