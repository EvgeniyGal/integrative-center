"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/app/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { questions } from "@/lib/db/schema";

const questionSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  published: z.coerce.boolean().optional(),
});

export async function createQuestionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = questionSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Check the question fields." };

  await db.insert(questions).values({
    question: parsed.data.question,
    answer: parsed.data.answer,
    sortOrder: parsed.data.sortOrder,
    published: parsed.data.published ?? true,
  });
  updateTag("questions");
  revalidatePath("/admin/questions");
  revalidatePath("/");
  return { success: "Question created." };
}

export async function updateQuestionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing question id." };

  const parsed = questionSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: "Check the question fields." };

  await db
    .update(questions)
    .set({
      question: parsed.data.question,
      answer: parsed.data.answer,
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published ?? false,
      updatedAt: new Date(),
    })
    .where(eq(questions.id, id));
  updateTag("questions");
  revalidatePath("/admin/questions");
  revalidatePath("/");
  return { success: "Question updated." };
}

export async function deleteQuestionAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing question id.");
  await db.delete(questions).where(eq(questions.id, id));
  updateTag("questions");
  revalidatePath("/admin/questions");
  revalidatePath("/");
}

export async function setQuestionPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = formData.get("value") === "true";
  if (!id) throw new Error("Missing question id.");
  if (field !== "published") {
    throw new Error("Invalid question flag.");
  }

  await db
    .update(questions)
    .set({ published: value, updatedAt: new Date() })
    .where(eq(questions.id, id));

  updateTag("questions");
  revalidatePath("/admin/questions");
  revalidatePath("/");
}

export async function reorderQuestionsAction(orderedIds: string[]) {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(questions)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(questions.id, id)),
    ),
  );

  updateTag("questions");
  revalidatePath("/admin/questions");
  revalidatePath("/");
}
