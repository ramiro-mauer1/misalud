import { MagnifyingGlass, X } from '@phosphor-icons/react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar por estudio, médico, síntoma o droga...',
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <MagnifyingGlass
          weight="bold"
          size={18}
          className="absolute left-3.5 text-accent-sage pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-surface border border-border-subtle/90 rounded-2xl py-2.5 pl-10 pr-10 text-text-primary placeholder:text-text-secondary/50 text-[13px] font-sans shadow-2xs outline-none focus:ring-2 focus:ring-accent-teal/20 focus:border-accent-teal transition-all duration-200"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 p-1 rounded-full text-text-secondary hover:text-text-primary active:scale-90 transition-transform cursor-pointer"
            type="button"
            aria-label="Limpiar búsqueda"
          >
            <X weight="bold" size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
