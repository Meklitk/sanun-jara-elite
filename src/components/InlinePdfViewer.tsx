import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

type InlinePdfViewerProps = {
  src: string;
  title: string;
  lang?: "fr" | "en";
  className?: string;
};

function getDevicePixelRatio() {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2.5);
}

function PdfPageCanvas({
  pdf,
  pageNumber,
  containerWidth,
  title,
}: {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  containerWidth: number;
  title: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas || containerWidth <= 0) return;

    (async () => {
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const cssScale = containerWidth / baseViewport.width;
      const pixelRatio = getDevicePixelRatio();
      const renderViewport = page.getViewport({ scale: cssScale * pixelRatio });
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      const cssWidth = Math.floor(containerWidth);
      const cssHeight = Math.floor(renderViewport.height / pixelRatio);

      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport: renderViewport }).promise;
    })();

    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber, containerWidth, title]);

  return (
    <canvas
      ref={canvasRef}
      className="block max-w-full bg-white"
      aria-label={`${title} — page ${pageNumber}`}
    />
  );
}

export default function InlinePdfViewer({ src, title, lang = "fr", className }: InlinePdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      setContainerWidth(Math.floor(element.clientWidth));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    window.addEventListener("orientationchange", updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", updateWidth);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let activePdf: PDFDocumentProxy | null = null;

    setPdf(null);
    setPageCount(0);
    setStatus("loading");

    getDocument(src)
      .promise.then((doc) => {
        if (cancelled) {
          doc.destroy();
          return;
        }
        activePdf = doc;
        setPdf(doc);
        setPageCount(doc.numPages);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      activePdf?.destroy();
    };
  }, [src]);

  const loadingLabel = lang === "fr" ? "Chargement du document..." : "Loading document...";
  const errorLabel =
    lang === "fr"
      ? "Impossible d'afficher ce document dans le navigateur."
      : "Unable to display this document in the browser.";
  const openLabel = lang === "fr" ? "Ouvrir le PDF" : "Open PDF";

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-[1.25rem] border border-gold/15 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:rounded-[1.5rem] ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/10 px-3 py-2.5 sm:px-4">
        <p className="min-w-0 truncate text-[11px] uppercase tracking-[0.18em] text-gold/70">{title}</p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold transition hover:border-gold/40"
        >
          {openLabel}
        </a>
      </div>

      {status === "loading" ? (
        <div className="flex min-h-[280px] items-center justify-center p-6 text-sm text-foreground/72">
          {loadingLabel}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 p-6 text-center text-sm text-foreground/76">
          <p>{errorLabel}</p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold transition hover:border-gold/40"
          >
            {openLabel}
          </a>
        </div>
      ) : null}

      {status === "ready" && pdf && containerWidth > 0 ? (
        <div className="touch-pan-y overflow-x-auto">
          {Array.from({ length: pageCount }, (_, index) => (
            <div key={`${src}-page-${index + 1}`} className="border-b border-gold/10 last:border-b-0">
              <PdfPageCanvas
                pdf={pdf}
                pageNumber={index + 1}
                containerWidth={containerWidth}
                title={title}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
