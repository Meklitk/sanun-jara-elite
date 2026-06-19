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
      const scale = containerWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
    })();

    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber, containerWidth, title]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-auto w-full bg-white"
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
    return () => observer.disconnect();
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
        <div className="space-y-0">
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
