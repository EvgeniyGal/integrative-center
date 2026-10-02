"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/app/admin/actions/auth";
import {
  deleteRagDocument,
  ingestRagDocument,
  reindexRagDocument,
  setRagDocumentEnabled,
} from "@/lib/ai/rag/ingest";
import { requireUserManager } from "@/lib/auth/session";

function revalidateRag() {
  revalidatePath("/admin/settings");
}

export async function createRagDocumentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const enabled = formData.get("enabled") === "on";
  const file = formData.get("file");

  if (!title) return { error: "Title is required." };
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a PDF, DOCX, or TXT file." };
  }

  try {
    await ingestRagDocument({
      title,
      description: description || null,
      file,
      enabled,
    });
    revalidateRag();
    return { success: "Document indexed and ready for retrieval." };
  } catch (error) {
    revalidateRag();
    return {
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}

export async function deleteRagDocumentAction(
  formData: FormData,
): Promise<void> {
  await requireUserManager();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteRagDocument(id);
  revalidateRag();
}

export async function toggleRagDocumentAction(
  formData: FormData,
): Promise<void> {
  await requireUserManager();
  const id = String(formData.get("id") ?? "");
  const enabled = formData.get("enabled") === "true";
  if (!id) return;
  await setRagDocumentEnabled(id, enabled);
  revalidateRag();
}

export async function reindexRagDocumentAction(
  formData: FormData,
): Promise<ActionState> {
  await requireUserManager();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Document id is required." };

  try {
    await reindexRagDocument(id);
    revalidateRag();
    return { success: "Document reindexed." };
  } catch (error) {
    revalidateRag();
    return {
      error: error instanceof Error ? error.message : "Reindex failed.",
    };
  }
}
