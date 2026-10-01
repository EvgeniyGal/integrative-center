"use server";

import { requireAdmin } from "@/lib/auth/session";
import { uploadFileToBlob, uploadImageAsWebp } from "@/lib/media/upload";

export async function uploadAdminImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }

  const folderRaw = String(formData.get("folder") ?? "media");
  const folder = folderRaw.replace(/[^a-z0-9/_-]/gi, "") || "media";

  try {
    const url = await uploadImageAsWebp(file, folder);
    return { url };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}

export async function uploadAdminDocumentAction(
  formData: FormData,
): Promise<{ url?: string; fileName?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("document");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a PDF to upload." };
  }

  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return { error: "Only PDF documents are supported." };
  }

  const folderRaw = String(formData.get("folder") ?? "services/documents");
  const folder = folderRaw.replace(/[^a-z0-9/_-]/gi, "") || "services/documents";

  try {
    const result = await uploadFileToBlob(file, folder, {
      maxBytes: 20 * 1024 * 1024,
    });
    return { url: result.url, fileName: result.fileName };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}
