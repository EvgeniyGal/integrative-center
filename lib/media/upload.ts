import { put } from "@vercel/blob";
import sharp from "sharp";

const MAX_BYTES = 12 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;
const MAX_EDGE = 2400;

function basenameWithoutExt(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "image";
}

function sanitizeFileBase(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "document";
}

/**
 * Convert an uploaded image to WebP and store it on Vercel Blob.
 * SVGs are uploaded as-is (no raster conversion).
 */
export async function uploadImageAsWebp(
  file: File,
  folder: string,
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is too large (max 12MB)");
  }

  const base = basenameWithoutExt(file.name);
  const stamp = Date.now();

  if (file.type === "image/svg+xml") {
    const blob = await put(`${folder}/${stamp}-${base}.svg`, file, {
      access: "public",
      contentType: "image/svg+xml",
    });
    return blob.url;
  }

  const input = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(input)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  const blob = await put(`${folder}/${stamp}-${base}.webp`, webp, {
    access: "public",
    contentType: "image/webp",
  });
  return blob.url;
}

/**
 * Store a non-image file on Vercel Blob with its original content type.
 */
export async function uploadFileToBlob(
  file: File,
  folder: string,
  options?: { allowedTypes?: string[]; maxBytes?: number },
): Promise<{ url: string; fileName: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const allowedTypes = options?.allowedTypes;
  const maxBytes = options?.maxBytes ?? MAX_DOCUMENT_BYTES;

  if (allowedTypes && allowedTypes.length > 0) {
    const typeOk =
      allowedTypes.includes(file.type) ||
      (file.type === "" && allowedTypes.includes(""));
    if (!typeOk) {
      throw new Error(`File type not allowed (${file.type || "unknown"})`);
    }
  }
  if (file.size > maxBytes) {
    throw new Error(
      `File is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB)`,
    );
  }

  const originalName = file.name.trim() || "document.pdf";
  const extMatch = originalName.match(/(\.[a-z0-9]+)$/i);
  const ext = extMatch?.[1]?.toLowerCase() || ".pdf";
  const base = sanitizeFileBase(originalName);
  const stamp = Date.now();
  const storedName = `${stamp}-${base}${ext}`;

  const blob = await put(`${folder}/${storedName}`, file, {
    access: "public",
    contentType: file.type || "application/octet-stream",
  });

  return { url: blob.url, fileName: originalName };
}
