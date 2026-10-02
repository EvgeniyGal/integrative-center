import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

export async function extractDocumentText(
  buffer: ArrayBuffer,
  mimeType: string,
): Promise<string> {
  if (mimeType === "application/pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const result = await extractText(pdf, { mergePages: true });
    const text = Array.isArray(result.text)
      ? result.text.join("\n")
      : String(result.text ?? "");
    return cleanExtractedText(text);
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      arrayBuffer: buffer,
    });
    return cleanExtractedText(result.value ?? "");
  }

  if (mimeType === "text/plain") {
    return cleanExtractedText(new TextDecoder("utf-8").decode(buffer));
  }

  throw new Error("Unsupported file type. Use PDF, DOCX, or TXT.");
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
