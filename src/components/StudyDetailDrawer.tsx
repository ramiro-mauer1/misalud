import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  ShareNetwork,
  Flask,
  ImageSquare,
  Pill,
  Stethoscope,
  X,
  Buildings,
  CalendarBlank,
  Copy,
  Check,
  FilePdf,
  MagnifyingGlassPlus,
  Trash,
  Eye,
  DownloadSimple,
} from '@phosphor-icons/react';
import type { ClinicalStudy, StudyType } from '../types/study';
import { useState, useEffect } from 'react';
import { PdfViewerModal } from './PdfViewerModal';

export interface StudyDetailDrawerProps {
  study: ClinicalStudy | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const typeConfig: Record<
  StudyType,
  { label: string; Icon: React.ElementType; colorClass: string; badgeText: string }
> = {
  laboratorio: {
    label: 'Laboratorio Clínico',
    Icon: Flask,
    colorClass: 'bg-accent-mint text-accent-teal border-accent-teal/20',
    badgeText: 'Análisis Bioquímico',
  },
  imagen: {
    label: 'Diagnóstico por Imágenes',
    Icon: ImageSquare,
    colorClass: 'bg-[#E8E4F0] text-[#5B4A82] border-[#5B4A82]/20',
    badgeText: 'Informe Radiológico',
  },
  receta: {
    label: 'Prescripción Digital',
    Icon: Pill,
    colorClass: 'bg-[#FFF3E0] text-[#8B6914] border-[#8B6914]/20',
    badgeText: 'Receta Electrónica',
  },
};

export function StudyDetailDrawer({ study, isOpen, onClose, onDelete }: StudyDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (study?.fileBlob) {
      const url = URL.createObjectURL(study.fileBlob);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [study]);

  if (!study || !mounted) return null;

  const config = typeConfig[study.type];
  const Icon = config.Icon;

  const isImage = Boolean(
    study.fileType?.startsWith('image/') ||
    study.fileName?.match(/\.(jpe?g|png|webp|heic)$/i)
  );

  const isPdf = Boolean(
    study.fileType === 'application/pdf' ||
    study.fileName?.toLowerCase().endsWith('.pdf') ||
    (!isImage && (study.fileBlob || study.fileUrl))
  );

  const handleCopySummary = () => {
    navigator.clipboard?.writeText(
      `*${study.title}*\n${study.summary}\nProfesional: ${study.professional} (${study.institution})\nFecha: ${study.date}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: study.title,
          text: `Estudio médico: ${study.title}\n${study.summary}`,
        });
      } catch {
        // Fallback
      }
    } else {
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    }
  };

  const handleDelete = () => {
    if (confirm(`¿Deseas eliminar el estudio "${study.title}" de tu bóveda?`)) {
      if (onDelete) {
        onDelete(study.id);
      }
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const drawerContent = (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none overflow-hidden">
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs pointer-events-auto"
            />

            {/* Bottom Sheet Drawer Frame */}
            <div className="w-full max-w-md mx-auto pointer-events-auto z-50 flex flex-col justify-end">
              <motion.div
                key="drawer"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                drag="y"
                dragDirectionLock
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.3 }}
                onDragEnd={(_e, { offset, velocity }) => {
                  if (offset.y > 100 || velocity.y > 400) {
                    onClose();
                  }
                }}
                className="w-full bg-surface rounded-t-3xl max-h-[90vh] flex flex-col shadow-[0_-8px_32px_rgba(26,46,43,0.18)] border-t border-border-subtle overflow-hidden"
              >
                {/* Grab Handle */}
                <div className="w-12 h-1.5 bg-border-subtle rounded-full mx-auto mt-3 mb-2 flex-shrink-0 cursor-grab active:cursor-grabbing" />

                {/* Header Section */}
                <div className="flex-shrink-0 px-5 pt-1 pb-3 border-b border-border-subtle/70">
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold border ${config.colorClass}`}
                    >
                      <Icon weight="bold" size={13} />
                      <span>{config.badgeText}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onDelete && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 hover:bg-rose-100 active:scale-90 transition-all cursor-pointer"
                          aria-label="Eliminar estudio"
                        >
                          <Trash weight="bold" size={13} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary hover:text-text-primary active:scale-90 transition-transform cursor-pointer"
                      >
                        <X weight="bold" size={14} />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-text-primary mt-2.5 leading-snug tracking-tight">
                    {study.title}
                  </h2>

                  {/* Doctor & Date Pills */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[12px] text-text-secondary">
                    <div className="inline-flex items-center gap-1.5 bg-surface-subtle px-2.5 py-1 rounded-lg border border-border-subtle/70">
                      <Stethoscope size={13} weight="bold" className="text-accent-teal" />
                      <span className="font-medium text-text-primary">{study.professional}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-surface-subtle px-2.5 py-1 rounded-lg border border-border-subtle/70">
                      <Buildings size={13} weight="bold" className="text-accent-sage" />
                      <span>{study.institution}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-surface-subtle px-2.5 py-1 rounded-lg border border-border-subtle/70 font-mono text-[11px]">
                      <CalendarBlank size={13} weight="bold" className="text-accent-sage" />
                      <span>{formatDate(study.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-view">
                  
                  {/* Original Attached File Card with Direct Expand / Open Actions */}
                  {previewUrl || study.fileBlob ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-accent-teal">
                          Archivo Original del Estudio
                        </span>
                        <span className="text-[10px] font-mono text-text-secondary">
                          IndexedDB Local
                        </span>
                      </div>

                      {isImage ? (
                        <div className="relative group rounded-2xl overflow-hidden border border-border-subtle bg-surface-subtle shadow-xs">
                          <img
                            src={previewUrl || ''}
                            alt={study.title}
                            className="w-full h-44 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onClick={() => setIsLightboxOpen(true)}
                          />
                          <div
                            onClick={() => setIsLightboxOpen(true)}
                            className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer gap-2 text-white font-semibold text-[13px]"
                          >
                            <MagnifyingGlassPlus size={20} weight="bold" />
                            <span>Tocar para Ampliar</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-accent-mint/70 flex items-center justify-center text-accent-teal flex-shrink-0">
                              <FilePdf size={22} weight="bold" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-bold text-text-primary truncate">
                                {study.fileName || 'documento.pdf'}
                              </p>
                              <p className="text-[11px] font-mono text-text-secondary">
                                {study.fileSize ? `${(study.fileSize / 1024).toFixed(1)} KB` : 'PDF Médico'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setIsPdfViewerOpen(true)}
                              className="px-3.5 py-2 bg-accent-teal text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-transform cursor-pointer hover:bg-accent-teal/95"
                            >
                              <Eye size={15} weight="bold" />
                              <span>Ver PDF</span>
                            </button>

                            <a
                              href={previewUrl || ''}
                              download={study.fileName || 'documento_clinico.pdf'}
                              className="w-8 h-8 rounded-xl bg-surface border border-border-subtle flex items-center justify-center text-text-secondary hover:text-accent-teal active:scale-90 transition-transform cursor-pointer"
                              title="Descargar archivo"
                            >
                              <DownloadSimple size={15} weight="bold" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Resumen del Contenido */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-accent-teal">
                      Resumen del Contenido
                    </span>
                    <div className="mt-1.5 p-3.5 bg-accent-mint/30 border border-accent-teal/20 rounded-2xl">
                      <p className="text-[13px] font-medium text-text-primary leading-relaxed">
                        {study.summary}
                      </p>
                    </div>
                  </div>

                  {/* Hallazgos Clínicos e Información Extraída */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-text-secondary">
                      {study.type === 'receta' ? 'Indicaciones y Posología' : 'Detalle Clínico'}
                    </span>
                    <div className="mt-1.5 p-4 bg-canvas rounded-2xl border border-border-subtle font-mono text-[12px] text-text-primary leading-relaxed whitespace-pre-line shadow-2xs">
                      {study.details}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-5 py-3 border-t border-border-subtle bg-surface flex gap-2 pb-[max(env(safe-area-inset-bottom),14px)]">
                  {onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3.5 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-[13px] flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer hover:bg-rose-100"
                    >
                      <Trash weight="bold" size={16} />
                      <span>Eliminar</span>
                    </button>
                  )}

                  {isPdf && (
                    <button
                      type="button"
                      onClick={() => setIsPdfViewerOpen(true)}
                      className="flex-1 py-3 px-3 rounded-2xl bg-accent-teal/10 text-accent-teal border border-accent-teal/20 font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer hover:bg-accent-teal/15"
                    >
                      <FilePdf weight="bold" size={16} />
                      <span>Leer PDF</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex-1 py-3 px-3 rounded-2xl border border-border-subtle bg-surface text-text-primary font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer hover:bg-surface-subtle"
                  >
                    {copied ? (
                      <>
                        <Check weight="bold" size={16} className="text-emerald-600" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy weight="bold" size={16} />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 py-3 px-3 rounded-2xl bg-accent-teal text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-transform cursor-pointer"
                  >
                    <ShareNetwork weight="bold" size={16} />
                    <span>{shared ? 'Enlace Copiado' : 'Compartir'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen High-Res Image Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && previewUrl && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center justify-center"
            >
              {/* Close Lightbox Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center cursor-pointer active:scale-90 transition-all z-10"
              >
                <X size={20} weight="bold" />
              </button>

              <img
                src={previewUrl}
                alt={study.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />

              <div className="mt-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-mono font-medium">
                {study.title}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* In-App PDF Reader Modal */}
      <PdfViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        fileBlob={study.fileBlob}
        fileUrl={previewUrl}
        fileName={study.fileName}
        title={study.title}
      />
    </>
  );

  return createPortal(drawerContent, document.body);
}
