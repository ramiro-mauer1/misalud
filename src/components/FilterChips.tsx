import type React from 'react';
import { motion } from 'framer-motion';
import { FunnelSimple, Flask, ImageSquare, Pill } from '@phosphor-icons/react';
import type { StudyType } from '../types/study';

export type FilterType = StudyType | 'todos';

export interface FilterChipsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts?: Record<FilterType, number>;
}

const filters: { id: FilterType; label: string; Icon: React.ElementType }[] = [
  { id: 'todos', label: 'Todos', Icon: FunnelSimple },
  { id: 'laboratorio', label: 'Laboratorio', Icon: Flask },
  { id: 'imagen', label: 'Imágenes', Icon: ImageSquare },
  { id: 'receta', label: 'Recetas', Icon: Pill },
];

export function FilterChips({
  activeFilter,
  onFilterChange,
  counts = { todos: 6, laboratorio: 2, imagen: 2, receta: 2 },
}: FilterChipsProps) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 py-0.5"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {filters.map(({ id, label, Icon }) => {
        const isActive = activeFilter === id;
        const count = counts[id];

        return (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            type="button"
            className={`
              relative flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-150 cursor-pointer active:scale-95 select-none
              ${
                isActive
                  ? 'text-white font-semibold'
                  : 'bg-surface text-text-secondary border border-border-subtle/80 hover:text-text-primary'
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 bg-accent-teal rounded-full shadow-[0_2px_8px_rgba(42,122,120,0.3)] -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <Icon weight={isActive ? 'bold' : 'regular'} size={14} />
            <span>{label}</span>
            {typeof count === 'number' && (
              <span
                className={`
                  text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold
                  ${isActive ? 'bg-white/25 text-white' : 'bg-surface-subtle text-text-secondary'}
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
