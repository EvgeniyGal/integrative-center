"use server";

import { requireAdmin } from "@/lib/auth/session";
import { uploadImageAsWebp } from "@/lib/media/upload";

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
