import type React from 'react';
import {
  Flask,
  ImageSquare,
  Pill,
  Stethoscope,
  CaretRight,
  WarningCircle,
  CheckCircle,
} from '@phosphor-icons/react';
import type { ClinicalStudy, StudyType } from '../types/study';

export interface StudyCardProps {
  study: ClinicalStudy;
  index: number;
  onClick: () => void;
}

const typeConfig: Record<
  StudyType,
  {
    label: string;
    Icon: React.ElementType;
    badgeClass: string;
    accentBorder: string;
  }
> = {
  laboratorio: {
    label: 'Laboratorio',
    Icon: Flask,
    badgeClass: 'bg-accent-mint/70 text-accent-teal border-accent-teal/20',
    accentBorder: 'border-l-accent-teal',
  },
  imagen: {
    label: 'Diagnóstico por Imagen',
    Icon: ImageSquare,
    badgeClass: 'bg-[#E8E4F0] text-[#5B4A82] border-[#5B4A82]/20',
    accentBorder: 'border-l-[#5B4A82]',
  },
  receta: {
    label: 'Receta Digital',
    Icon: Pill,
    badgeClass: 'bg-[#FFF3E0] text-[#8B6914] border-[#8B6914]/20',
    accentBorder: 'border-l-[#8B6914]',
  },
};

export function StudyCard({ study, index, onClick }: StudyCardProps) {
  const config = typeConfig[study.type];
  const Icon = config.Icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate();
    const month = date.toLocaleString('es-AR', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const hasWarning = study.summary.includes('⚠️') || study.summary.toLowerCase().includes('lesión') || study.summary.toLowerCase().includes('elevada') || study.summary.toLowerCase().includes('baja');

  return (
    <div
      onClick={onClick}
      className="bg-surface-subtle/70 p-1.5 rounded-3xl border border-border-subtle/80 shadow-2xs animate-fade-slide-up cursor-pointer group active:scale-[0.98] transition-transform duration-150"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="bg-surface rounded-[calc(1.5rem-6px)] p-4 border border-border-subtle/40 transition-shadow duration-200 group-hover:shadow-md">
        
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold border ${config.badgeClass}`}
          >
            <Icon weight="bold" size={12} />
            <span>{config.label}</span>
          </div>

          <div className="text-[11px] font-mono text-text-secondary tracking-tight font-medium bg-surface-subtle px-2 py-0.5 rounded-md border border-border-subtle/60">
            {formatDate(study.date)}
          </div>
        </div>

        {/* Study Title */}
        <h3 className="text-[15px] font-bold text-text-primary mt-2.5 leading-snug tracking-tight group-hover:text-accent-teal transition-colors">
          {study.title}
        </h3>

        {/* Doctor & Facility */}
        <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mt-1.5">
          <Stethoscope size={14} weight="bold" className="text-accent-sage flex-shrink-0" />
          <span className="truncate font-medium">{study.professional}</span>
          <span className="text-border-subtle">·</span>
          <span className="truncate text-text-secondary/80">{study.institution}</span>
        </div>

        {/* Clinical One-Line Summary Box */}
        <div className="mt-3 p-2.5 rounded-xl bg-canvas border border-border-subtle/70 flex items-start gap-2">
          {hasWarning ? (
            <WarningCircle size={15} weight="fill" className="text-amber-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle size={15} weight="fill" className="text-accent-teal flex-shrink-0 mt-0.5" />
          )}
          <p className="text-[12px] text-text-primary/90 line-clamp-2 leading-relaxed font-normal">
            {study.summary}
          </p>
        </div>

        {/* Footer info & Tap indicator */}
        <div className="mt-3 pt-2 border-t border-border-subtle/60 flex items-center justify-between text-text-secondary">
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent-sage font-bold">
            Ver Estudio y Archivo
          </span>
          <div className="w-5 h-5 rounded-full bg-surface-subtle flex items-center justify-center text-accent-teal group-hover:translate-x-0.5 transition-transform">
            <CaretRight size={12} weight="bold" />
          </div>
        </div>
      </div>
    </div>
  );
}
