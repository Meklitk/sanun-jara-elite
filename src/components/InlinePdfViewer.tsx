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

function useIsMobilePdfViewer() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function getDevicePixelRatio() {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

function PdfPageCanvas({
  pdf,
  pageNumber,
  containerWidth,
  title,
  enabled,
}: {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  containerWidth: number;
  title: string;
  enabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(pageNumber === 1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas || !enabled || !visible || containerWidth <= 0) return;

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
  }, [pdf, pageNumber, containerWidth, title, enabled, visible]);

  return (
    <div ref={rootRef} className="border-b border-gold/10 last:border-b-0">
      {visible ? (
        <canvas
          ref={canvasRef}
          className="block max-w-full bg-white"
          aria-label={`${title} — page ${pageNumber}`}
        />
      ) : (
        <div className="flex min-h-[320px] items-center justify-center bg-white/95 text-xs text-black/45">
          …
        </div>
      )}
    </div>
  );
}

function NativePdfEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div className="touch-pan-y overflow-hidden bg-white">
      <iframe
        src={src}
        title={title}
        className="h-[min(78vh,920px)] w-full border-0 bg-white"
        loading="lazy"
      />
    </div>
  );
}

export default function InlinePdfViewer({ src, title, lang = "fr", className }: InlinePdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const isMobile = useIsMobilePdfViewer();

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
    if (isMobile) {
      setStatus("ready");
      setPdf(null);
      setPageCount(0);
      return;
    }

    let cancelled = false;
    let activePdf: PDFDocumentProxy | null = null;

    setPdf(null);
    setPageCount(0);
    setStatus("loading");

    (async () => {
      try {
        const response = await fetch(src, { credentials: "same-origin" });
        if (!response.ok) throw new Error("fetch_failed");

        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("text/html") || contentType.includes("application/json")) {
          throw new Error("invalid_content_type");
        }

        const data = await response.arrayBuffer();
        if (cancelled) return;

        const doc = await getDocument({ data, disableAutoFetch: true, disableStream: true }).promise;
        if (cancelled) {
          doc.destroy();
          return;
        }

        activePdf = doc;
        setPdf(doc);
        setPageCount(doc.numPages);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      activePdf?.destroy();
    };
  }, [src, isMobile]);

  const loadingLabel = lang === "fr" ? "Chargement du document..." : "Loading document...";
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

      {isMobile ? (
        <NativePdfEmbed src={src} title={title} />
      ) : status === "loading" ? (
        <div className="flex min-h-[280px] items-center justify-center p-6 text-sm text-foreground/72">
          {loadingLabel}
        </div>
      ) : null}

      {!isMobile && status === "error" ? (
        <NativePdfEmbed src={src} title={title} />
      ) : null}

      {!isMobile && status === "ready" && pdf && containerWidth > 0 ? (
        <div className="touch-pan-y overflow-x-auto">
          {Array.from({ length: pageCount }, (_, index) => (
            <PdfPageCanvas
              key={`${src}-page-${index + 1}`}
              pdf={pdf}
              pageNumber={index + 1}
              containerWidth={containerWidth}
              title={title}
              enabled
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
