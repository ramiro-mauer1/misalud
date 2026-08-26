import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Cpu,
  CheckCircle,
  Stethoscope,
  Pill,
} from '@phosphor-icons/react';

export interface AnalyzingStateProps {
  fileName?: string;
}

export function AnalyzingState({ fileName = 'Estudio_Clinico.jpg' }: AnalyzingStateProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      title: 'Digitalización y corrección geométrica',
      detail: 'Eliminando reflejos y enfocando tipografía médica...',
    },
    {
      title: 'Extracción semántica Zero-Data-Entry',
      detail: 'Identificando diagnósticos, medicación y rangos clínicos...',
    },
    {
      title: 'Cifrado e indexación en Bóveda',
      detail: 'Guardando registro médico estructurado...',
    },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStepIndex(1), 1200);
    const t2 = setTimeout(() => setStepIndex(2), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-3">
      {/* Outer Card with Double-Bezel Architecture */}
      <div className="w-full max-w-sm bg-surface-subtle/80 p-2 rounded-3xl border border-border-subtle shadow-lg">
        <div className="bg-surface rounded-[calc(1.5rem-6px)] p-6 flex flex-col items-center text-center relative overflow-hidden border border-border-subtle/60">
          
          {/* Animated Clinical AI Scanner Hub */}
          <div className="relative w-24 h-24 my-2 flex items-center justify-center">
            {/* Pulsing Concentric Rings */}
            <motion.div
              className="absolute inset-0 rounded-full bg-accent-teal/10"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-dashed border-accent-teal/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />

            {/* Central Core Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-mint to-accent-teal/20 border border-accent-teal/30 flex items-center justify-center shadow-inner relative z-10">
              <Cpu size={32} weight="bold" className="text-accent-teal" />
            </div>
          </div>

          {/* Title & File Name */}
          <h2 className="text-base font-semibold text-text-primary mt-3 tracking-tight">
            Procesando Estudio Médico
          </h2>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-subtle rounded-full border border-border-subtle text-[11px] text-text-secondary mt-2 max-w-[240px] truncate">
            <FileText size={14} weight="bold" className="text-accent-teal flex-shrink-0" />
            <span className="truncate font-mono">{fileName}</span>
          </div>

          {/* Progressive Real-time Timeline */}
          <div className="w-full mt-6 space-y-3 text-left">
            {steps.map((step, idx) => {
              const isCompleted = stepIndex > idx;
              const isCurrent = stepIndex === idx;

              return (
                <div
                  key={idx}
                  className={`
                    p-2.5 rounded-2xl border transition-all duration-300 flex items-start gap-2.5
                    ${
                      isCurrent
                        ? 'bg-accent-mint/30 border-accent-teal/30 shadow-2xs'
                        : isCompleted
                        ? 'bg-surface-subtle/50 border-border-subtle opacity-90'
                        : 'bg-transparent border-transparent opacity-40'
                    }
                  `}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle size={17} weight="fill" className="text-accent-teal" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-accent-teal border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-accent-sage/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-semibold leading-tight ${isCurrent ? 'text-accent-teal' : 'text-text-primary'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-text-secondary mt-0.5 leading-snug">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Extracted Entities Simulation Chips */}
          <div className="w-full mt-4 pt-3 border-t border-border-subtle/80 flex flex-wrap gap-1.5 justify-center">
            {stepIndex >= 1 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 text-[10px] bg-accent-mint/60 text-accent-teal font-medium px-2 py-0.5 rounded-full border border-accent-teal/20 font-mono"
              >
                <Stethoscope size={11} weight="bold" /> Dr. Verificado
              </motion.span>
            )}
            {stepIndex >= 2 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 text-[10px] bg-[#FFF3E0] text-[#8B6914] font-medium px-2 py-0.5 rounded-full border border-amber-300 font-mono"
              >
                <Pill size={11} weight="bold" /> Prescripción detectada
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
