"use client";

import { useCallback, useEffect, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

type PdfjsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfjsModule> | null = null;

export async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

const docCache = new Map<string, Promise<PDFDocumentProxy>>();

export function loadPdfDocument(url: string) {
  const key = url.split("#")[0] ?? url;
  let pending = docCache.get(key);
  if (!pending) {
    pending = getPdfjs()
      .then((pdfjs) =>
        pdfjs.getDocument({
          url: key,
          withCredentials: false,
        }).promise,
      )
      .catch((error) => {
        docCache.delete(key);
        throw error;
      });
    docCache.set(key, pending);
  }
  return pending;
}

function isCancelledError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String(error.name) : "";
  return (
    name === "RenderingCancelledException" ||
    name === "AbortException" ||
    ("message" in error &&
      /cancel|abort/i.test(String((error as { message?: string }).message)))
  );
}

export function usePdfPage(
  url: string | null | undefined,
  pageNumber: number,
  maxWidth: number,
) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    setCanvas(node);
  }, []);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (!url || !canvas) return;

    let cancelled = false;
    let renderTask: RenderTask | null = null;

    setStatus("loading");

    (async () => {
      try {
        const pdf = await loadPdfDocument(url);
        if (cancelled) return;

        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const unscaled = page.getViewport({ scale: 1 });
        const scale = Math.min(2.5, maxWidth / unscaled.width);
        const viewport = page.getViewport({ scale });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");

        const transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform,
        });
        await renderTask.promise;
        if (cancelled) return;

        setPageCount(pdf.numPages);
        setStatus("ready");
      } catch (error) {
        if (cancelled || isCancelledError(error)) return;
        console.error("PDF preview failed", error);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      try {
        renderTask?.cancel();
      } catch {
        // ignore cancel errors
      }
    };
  }, [url, pageNumber, maxWidth, canvas]);

  return { canvasRef, status, pageCount };
}
