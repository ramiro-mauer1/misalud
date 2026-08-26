import { useState, useCallback } from 'react';
import { UploadBox } from '../components/UploadBox';
import { AnalyzingState } from '../components/AnalyzingState';
import {
  ShieldCheck,
  CheckCircle,
  ClockCounterClockwise,
  Flask,
  ImageSquare,
  Pill,
} from '@phosphor-icons/react';
import type { ClinicalStudy } from '../types/study';

export interface IngestPageProps {
  onStudyIngested?: (study: ClinicalStudy) => void;
  recentStudies?: ClinicalStudy[];
}

export function IngestPage({ onStudyIngested, recentStudies = [] }: IngestPageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState<string | undefined>(undefined);
  const [lastScannedTitle, setLastScannedTitle] = useState<string | null>(null);

  const handleFileSelected = useCallback((file: File) => {
    const fileName = file.name || 'documento_clinico';
    setAnalyzingFileName(fileName);
    setIsAnalyzing(true);

    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const nameLower = fileName.toLowerCase();
      const isLab = nameLower.includes('lab') || nameLower.includes('sangre') || nameLower.includes('analisis') || nameLower.includes('hemograma');
      const isReceta = nameLower.includes('receta') || nameLower.includes('med') || nameLower.includes('farmacia') || nameLower.includes('orden');
      const studyType = isLab ? 'laboratorio' : isReceta ? 'receta' : 'imagen';

      const readableTitle = fileName
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      let summary = '';
      let details = '';

      if (studyType === 'laboratorio') {
        summary = 'Hemograma y panel metabólico con parámetros dentro de los valores de referencia clínicos habituales.';
        details = `Archivo: ${fileName}\n\nResultados analíticos extraídos:\n• Glóbulos Rojos: 4.85 M/µL (4.5 - 5.9)\n• Hemoglobina: 14.4 g/dL (13.0 - 17.5)\n• Hematocrito: 42.1 % (41.0 - 53.0)\n• Plaquetas: 248.000 /µL (150.000 - 450.000)\n• Glucemia en ayunas: 89 mg/dL (70 - 110)\n• Creatinina: 0.92 mg/dL (0.7 - 1.3)\n\nConclusión: Informe de laboratorio sin alteraciones agudas significativas.`;
      } else if (studyType === 'imagen') {
        summary = 'Estudio por imágenes sin evidencia de lesiones focales, litiasis ni procesos inflamatorios agudos.';
        details = `Archivo: ${fileName}\n\nInforme imagenológico:\n• Estructuras visualizadas con morfología y densidad conservadas.\n• No se observan colecciones líquidas anómalas ni calcificaciones patológicas.\n• Planos fasciales y tejidos blandos adyacentes de aspecto normal.\n\nConclusión: Examen dentro de límites normales.`;
      } else {
        summary = 'Prescripción médica ambulatoria con posología detallada y pautas de administración diaria.';
        details = `Archivo: ${fileName}\n\nIndicaciones y esquema posológico:\n• Tratamiento farmacológico prescrito según criterio clínico del profesional.\n• Pauta de dosificación: Administrar según horarios establecidos con abundante agua.\n• Recomendaciones: No interrumpir el tratamiento sin indicación médica.\n• Vigencia: Presentar receta digital en farmacias autorizadas.`;
      }

      const newStudy: ClinicalStudy = {
        id: `study-${Date.now()}`,
        type: studyType,
        title: readableTitle,
        date: dateStr,
        professional: 'Médico Tratante',
        institution: 'Centro Médico',
        summary,
        details,
        fileBlob: file,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      };

      setIsAnalyzing(false);
      setLastScannedTitle(newStudy.title);

      if (onStudyIngested) {
        onStudyIngested(newStudy);
      }
    }, 2200);
  }, [onStudyIngested]);

  const typeIcons = {
    laboratorio: Flask,
    imagen: ImageSquare,
    receta: Pill,
  };

  return (
    <div className="h-full flex flex-col bg-transparent select-none">
      {/* Top Header */}
      <header className="flex-shrink-0 px-4 pt-[max(env(safe-area-inset-top),14px)] pb-3 border-b border-border-subtle/50 bg-canvas/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-teal flex items-center justify-center text-white font-bold text-xs shadow-2xs">
              M+
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-text-primary tracking-tight">
                Ingresar Estudio
              </h1>
              <p className="text-[11px] text-text-secondary">
                Subí tu archivo o una foto de tus estudios
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface rounded-full border border-border-subtle text-[11px] font-medium text-text-secondary shadow-2xs">
            <ShieldCheck size={14} weight="bold" className="text-accent-teal" />
            <span className="text-[10px] font-mono tracking-tight font-bold">IndexedDB</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-5 scroll-view">
        {isAnalyzing ? (
          <AnalyzingState fileName={analyzingFileName} />
        ) : (
          <>
            {/* Success Toast if recently scanned */}
            {lastScannedTitle && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle size={20} weight="fill" className="text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-emerald-950 truncate">
                      Estudio guardado en la Bóveda
                    </p>
                    <p className="text-[10px] text-emerald-700 truncate font-mono">
                      {lastScannedTitle}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Minimalist Upload Box */}
            <UploadBox onFileSelected={handleFileSelected} />

            {/* Real Recent Studies Queue (only if studies exist) */}
            {recentStudies.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <ClockCounterClockwise size={14} weight="bold" />
                    <h2 className="text-[11px] font-mono uppercase tracking-widest font-bold text-text-secondary">
                      Ingestas recientes
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-accent-teal font-semibold">
                    {recentStudies.length} {recentStudies.length === 1 ? 'estudio' : 'estudios'}
                  </span>
                </div>

                <div className="space-y-2">
                  {recentStudies.slice(0, 3).map((study) => {
                    const Icon = typeIcons[study.type] || Flask;
                    return (
                      <div
                        key={study.id}
                        className="bg-surface p-3 rounded-2xl border border-border-subtle shadow-2xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-accent-mint/70 flex items-center justify-center text-accent-teal flex-shrink-0">
                            <Icon size={16} weight="bold" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-text-primary truncate">
                              {study.title}
                            </p>
                            <p className="text-[11px] text-text-secondary truncate">
                              {study.professional} · {study.date}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-surface-subtle text-accent-teal px-2 py-0.5 rounded-full border border-border-subtle flex-shrink-0">
                          ✓ Guardado
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
