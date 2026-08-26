import { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { FilterChips, FilterType } from '../components/FilterChips';
import { StudyCard } from '../components/StudyCard';
import { StudyDetailDrawer } from '../components/StudyDetailDrawer';
import type { ClinicalStudy } from '../types/study';
import type { UserProfile } from '../types/user';
import {
  Vault,
  MagnifyingGlass,
  ArrowClockwise,
  Plus,
  FolderDashed,
} from '@phosphor-icons/react';

export interface VaultPageProps {
  studies?: ClinicalStudy[];
  profile?: UserProfile;
  onScanClick?: () => void;
  onDeleteStudy?: (id: string) => void;
}

export function VaultPage({
  studies = [],
  profile,
  onScanClick,
  onDeleteStudy,
}: VaultPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [selectedStudy, setSelectedStudy] = useState<ClinicalStudy | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const counts: Record<FilterType, number> = useMemo(() => {
    return {
      todos: studies.length,
      laboratorio: studies.filter((s) => s.type === 'laboratorio').length,
      imagen: studies.filter((s) => s.type === 'imagen').length,
      receta: studies.filter((s) => s.type === 'receta').length,
    };
  }, [studies]);

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      if (activeFilter !== 'todos' && study.type !== activeFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matches =
          study.title.toLowerCase().includes(query) ||
          study.professional.toLowerCase().includes(query) ||
          study.institution.toLowerCase().includes(query) ||
          study.summary.toLowerCase().includes(query) ||
          study.details.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [studies, searchQuery, activeFilter]);

  const handleOpenDrawer = (study: ClinicalStudy) => {
    setSelectedStudy(study);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedStudy(null), 300);
  };

  const userGreeting = useMemo(() => {
    const rawName = profile?.name?.trim();
    if (rawName) {
      const firstName = rawName.split(' ')[0];
      return `Hola ${firstName}, estos son tus estudios que guardaste`;
    }
    return 'Hola, estos son tus estudios que guardaste';
  }, [profile]);

  return (
    <div className="h-full flex flex-col bg-transparent select-none">
      {/* Top Clinical Header */}
      <header className="flex-shrink-0 px-4 pt-[max(env(safe-area-inset-top),14px)] pb-3 border-b border-border-subtle/60 bg-canvas/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-accent-teal flex items-center justify-center text-white font-bold text-xs shadow-2xs flex-shrink-0">
              <Vault size={17} weight="bold" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-bold text-text-primary tracking-tight truncate">
                  Bóveda de Estudios
                </h1>
                <span className="text-[10px] font-mono bg-accent-mint text-accent-teal px-1.5 py-0.2 rounded-full font-bold flex-shrink-0">
                  {studies.length}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary truncate">
                {userGreeting}
              </p>
            </div>
          </div>

          {onScanClick && (
            <button
              type="button"
              onClick={onScanClick}
              className="h-8 px-3 rounded-full bg-accent-teal text-white flex items-center gap-1 text-[11px] font-semibold active:scale-95 transition-transform shadow-2xs cursor-pointer flex-shrink-0 ml-2"
            >
              <Plus size={14} weight="bold" />
              <span>Nuevo</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        {studies.length > 0 && (
          <>
            <div className="mt-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Filter Chips Bar */}
            <div className="mt-2.5">
              <FilterChips
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
              />
            </div>
          </>
        )}
      </header>

      {/* Main Studies Feed */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-3 scroll-view">
        {studies.length === 0 ? (
          /* Clean Empty State when no studies exist */
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-surface border border-border-subtle flex items-center justify-center text-accent-teal mb-4 shadow-sm">
              <FolderDashed size={32} weight="bold" />
            </div>
            <h2 className="text-[16px] font-bold text-text-primary">
              Bóveda sin documentos
            </h2>
            <p className="text-[12px] text-text-secondary mt-1.5 max-w-[240px] leading-relaxed">
              No hay estudios médicos registrados. Escaneá o subí tu primer análisis o receta para comenzar.
            </p>
            {onScanClick && (
              <button
                type="button"
                onClick={onScanClick}
                className="mt-5 px-5 py-3 bg-accent-teal text-white rounded-2xl text-[13px] font-semibold flex items-center gap-2 shadow-sm active:scale-95 transition-transform cursor-pointer"
              >
                <Plus size={16} weight="bold" />
                Escanear Primer Estudio
              </button>
            )}
          </div>
        ) : filteredStudies.length > 0 ? (
          filteredStudies.map((study, i) => (
            <StudyCard
              key={study.id}
              study={study}
              index={i}
              onClick={() => handleOpenDrawer(study)}
            />
          ))
        ) : (
          /* Search / Filter with 0 results */
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-center text-accent-sage/60 mb-3 shadow-2xs">
              <MagnifyingGlass size={26} weight="bold" />
            </div>
            <p className="text-[14px] font-bold text-text-primary">
              Sin coincidencias
            </p>
            <p className="text-[12px] text-text-secondary mt-1 max-w-[220px]">
              No hay resultados para "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('todos');
              }}
              className="mt-4 px-4 py-2 bg-surface border border-border-subtle rounded-xl text-[12px] font-semibold text-accent-teal flex items-center gap-1.5 shadow-2xs active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowClockwise size={14} weight="bold" />
              Restablecer búsqueda
            </button>
          </div>
        )}
      </div>

      {/* Study Detail Bottom Sheet Drawer */}
      <StudyDetailDrawer
        study={selectedStudy}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onDelete={onDeleteStudy}
      />
    </div>
  );
}
