import { desc, eq } from "drizzle-orm";

import { chunkText } from "@/lib/ai/rag/chunk";
import {
  RAG_BLOB_FOLDER,
  RAG_MAX_FILE_BYTES,
  resolveRagMimeType,
} from "@/lib/ai/rag/constants";
import { embedTexts } from "@/lib/ai/rag/embed";
import { extractDocumentText } from "@/lib/ai/rag/parse";
import { db } from "@/lib/db";
import { ragChunks, ragDocuments } from "@/lib/db/schema";
import { deleteBlobUrls } from "@/lib/media/blob";
import { uploadFileToBlob } from "@/lib/media/upload";

export async function listRagDocuments() {
  return db
    .select()
    .from(ragDocuments)
    .orderBy(desc(ragDocuments.createdAt));
}

export async function ingestRagDocument(input: {
  title: string;
  description?: string | null;
  file: File;
  enabled?: boolean;
}): Promise<{ id: string }> {
  const mimeType = resolveRagMimeType(input.file);
  if (!mimeType) {
    throw new Error("Only PDF, DOCX, and TXT files are supported.");
  }
  if (input.file.size > RAG_MAX_FILE_BYTES) {
    throw new Error("File is too large (max 10MB).");
  }

  const title = input.title.trim();
  if (!title) throw new Error("Title is required.");

  const description = input.description?.trim() || null;
  const enabled = input.enabled ?? true;

  const uploaded = await uploadFileToBlob(input.file, RAG_BLOB_FOLDER, {
    maxBytes: RAG_MAX_FILE_BYTES,
  });

  const documentId = crypto.randomUUID();

  await db.insert(ragDocuments).values({
    id: documentId,
    title,
    description,
    blobUrl: uploaded.url,
    fileName: uploaded.fileName,
    mimeType,
    byteSize: input.file.size,
    enabled,
    status: "processing",
    error: null,
    chunkCount: 0,
  });

  try {
    await indexDocumentFromFile(documentId, input.file, mimeType, description);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Indexing failed.";
    await db
      .update(ragDocuments)
      .set({
        status: "failed",
        error: message,
        updatedAt: new Date(),
      })
      .where(eq(ragDocuments.id, documentId));
    throw error;
  }

  return { id: documentId };
}

export async function reindexRagDocument(documentId: string): Promise<void> {
  const rows = await db
    .select()
    .from(ragDocuments)
    .where(eq(ragDocuments.id, documentId))
    .limit(1);
  const doc = rows[0];
  if (!doc) throw new Error("Document not found.");

  await db
    .update(ragDocuments)
    .set({
      status: "processing",
      error: null,
      updatedAt: new Date(),
    })
    .where(eq(ragDocuments.id, documentId));

  try {
    const response = await fetch(doc.blobUrl);
    if (!response.ok) {
      throw new Error("Could not download the stored document for reindexing.");
    }
    const buffer = await response.arrayBuffer();
    const file = new File([buffer], doc.fileName, { type: doc.mimeType });
    await indexDocumentFromFile(
      documentId,
      file,
      doc.mimeType,
      doc.description,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Reindexing failed.";
    await db
      .update(ragDocuments)
      .set({
        status: "failed",
        error: message,
        updatedAt: new Date(),
      })
      .where(eq(ragDocuments.id, documentId));
    throw error;
  }
}

async function indexDocumentFromFile(
  documentId: string,
  file: File,
  mimeType: string,
  description: string | null,
): Promise<void> {
  const buffer = await file.arrayBuffer();
  const extracted = await extractDocumentText(buffer, mimeType);
  if (!extracted) {
    throw new Error(
      "No text could be extracted. Scanned PDFs without OCR are not supported.",
    );
  }

  const prefixed = description
    ? `Document context: ${description}\n\n${extracted}`
    : extracted;

  const chunks = chunkText(prefixed);
  if (chunks.length === 0) {
    throw new Error("Document produced no usable text chunks.");
  }

  const embeddings = await embedTexts(chunks.map((c) => c.content));
  if (embeddings.length !== chunks.length) {
    throw new Error("Embedding count did not match chunk count.");
  }

  await db.delete(ragChunks).where(eq(ragChunks.documentId, documentId));

  await db.insert(ragChunks).values(
    chunks.map((chunk, index) => ({
      id: crypto.randomUUID(),
      documentId,
      chunkIndex: chunk.chunkIndex,
      content: chunk.content,
      tokenEstimate: chunk.tokenEstimate,
      embedding: embeddings[index]!,
    })),
  );

  await db
    .update(ragDocuments)
    .set({
      status: "ready",
      error: null,
      chunkCount: chunks.length,
      updatedAt: new Date(),
    })
    .where(eq(ragDocuments.id, documentId));
}

export async function setRagDocumentEnabled(
  documentId: string,
  enabled: boolean,
): Promise<void> {
  await db
    .update(ragDocuments)
    .set({ enabled, updatedAt: new Date() })
    .where(eq(ragDocuments.id, documentId));
}

export async function deleteRagDocument(documentId: string): Promise<void> {
  const rows = await db
    .select()
    .from(ragDocuments)
    .where(eq(ragDocuments.id, documentId))
    .limit(1);
  const doc = rows[0];
  if (!doc) return;

  await db.delete(ragDocuments).where(eq(ragDocuments.id, documentId));
  await deleteBlobUrls([doc.blobUrl]);
}
