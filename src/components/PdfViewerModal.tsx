import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  DownloadSimple,
  SpinnerGap,
  WarningCircle,
  FilePdf,
} from '@phosphor-icons/react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for Vite bundling
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileBlob?: Blob;
  fileUrl?: string | null;
  fileName?: string;
  title?: string;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  fileBlob,
  fileUrl,
  fileName,
  title = 'Documento Clínico PDF',
}: PdfViewerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load PDF Document from Blob or URL
  useEffect(() => {
    if (!isOpen || (!fileBlob && !fileUrl)) return;

    let isCancelled = false;
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setZoom(1.0);

    async function loadPdf() {
      try {
        let loadingTask: pdfjsLib.PDFDocumentLoadingTask;

        if (fileBlob) {
          const arrayBuffer = await fileBlob.arrayBuffer();
          loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        } else if (fileUrl) {
          loadingTask = pdfjsLib.getDocument({ url: fileUrl });
        } else {
          throw new Error('No se encontró el archivo PDF.');
        }

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error al cargar PDF:', err);
        if (!isCancelled) {
          setError('No se pudo visualizar el PDF dentro de la app.');
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, fileBlob, fileUrl]);

  // Render current page onto canvas
  const renderPage = useCallback(
    async (pageNum: number, scale: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        // Cancel any ongoing render task
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(pageNum);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Determine viewport based on container width & zoom
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const screenWidth = Math.min(window.innerWidth - 32, 480);
        const baseScale = screenWidth / unscaledViewport.width;
        const finalScale = baseScale * scale;

        const viewport = page.getViewport({ scale: finalScale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        const renderContext = {
          canvasContext: context,
          viewport,
          canvas: canvas as unknown as HTMLCanvasElement,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: unknown) {
        if ((err as { name?: string })?.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err);
        }
      }
    },
    [pdfDoc]
  );

  useEffect(() => {
    if (!loading && pdfDoc && currentPage > 0) {
      renderPage(currentPage, zoom);
    }
  }, [loading, pdfDoc, currentPage, zoom, renderPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleDownload = () => {
    if (fileBlob) {
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'documento_clinico.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } else if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName || 'documento_clinico.pdf';
      a.click();
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-60 flex flex-col bg-neutral-950/95 backdrop-blur-lg select-none">
          {/* Top Header */}
          <header className="flex-shrink-0 px-4 py-3 border-b border-white/10 bg-neutral-900/80 backdrop-blur-md flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-accent-teal flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                <FilePdf size={18} weight="bold" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[14px] font-bold truncate tracking-tight">
                  {title}
                </h3>
                <p className="text-[11px] text-white/60 font-mono truncate">
                  {fileName || 'documento.pdf'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
                title="Descargar archivo"
              >
                <DownloadSimple size={16} weight="bold" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
                title="Cerrar visor"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          </header>

          {/* Main PDF Canvas Area */}
          <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-start scroll-view">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-white/80 gap-3">
                <SpinnerGap size={36} weight="bold" className="animate-spin text-accent-teal" />
                <p className="text-[13px] font-mono">Cargando páginas del estudio...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center text-white px-4 max-w-sm">
                <WarningCircle size={40} weight="fill" className="text-amber-400 mb-3" />
                <p className="text-[14px] font-bold">{error}</p>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-accent-teal text-white rounded-xl text-[12px] font-bold flex items-center gap-2 shadow-sm"
                >
                  <DownloadSimple size={15} weight="bold" />
                  <span>Descargar archivo</span>
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden my-auto"
              >
                <canvas ref={canvasRef} className="block max-w-full h-auto" />
              </motion.div>
            )}
          </div>

          {/* Bottom Floating Controls Bar */}
          {!loading && !error && numPages > 0 && (
            <footer className="flex-shrink-0 px-4 py-3 pb-[max(env(safe-area-inset-bottom),14px)] bg-neutral-900/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-white max-w-md mx-auto w-full">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.75}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 cursor-pointer active:scale-90 transition-all"
                  title="Reducir zoom"
                >
                  <MagnifyingGlassMinus size={15} weight="bold" />
                </button>

                <span className="text-[11px] font-mono text-white/80 w-10 text-center font-bold">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 2.5}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 cursor-pointer active:scale-90 transition-all"
                  title="Aumentar zoom"
                >
                  <MagnifyingGlassPlus size={15} weight="bold" />
                </button>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 cursor-pointer active:scale-90 transition-all"
                  title="Página anterior"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>

                <span className="text-[11px] font-mono font-bold bg-white/10 px-2.5 py-1 rounded-full text-white/90">
                  {currentPage} / {numPages}
                </span>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage >= numPages}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center disabled:opacity-30 cursor-pointer active:scale-90 transition-all"
                  title="Página siguiente"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>
            </footer>
          )}
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
