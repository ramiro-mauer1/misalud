import { motion } from 'framer-motion';
import { Vault, Plus, IdentificationCard } from '@phosphor-icons/react';

export interface BottomDockProps {
  activePage: number;
  onPageSelect: (page: number) => void;
  studyCount?: number;
}

export function BottomDock({ activePage, onPageSelect }: BottomDockProps) {
  const tabs = [
    {
      id: 0,
      label: 'Bóveda',
      Icon: Vault,
    },
    {
      id: 1,
      label: 'Ingresar',
      Icon: Plus,
    },
    {
      id: 2,
      label: 'Ficha',
      Icon: IdentificationCard,
    },
  ];

  const springTransition = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 28,
    mass: 0.7,
  };

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-5 left-0 right-0 z-40 pointer-events-none flex justify-center px-4 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <motion.div
        layout
        transition={springTransition}
        className="pointer-events-auto bg-surface/92 backdrop-blur-2xl border border-border-subtle/80 shadow-[0_12px_36px_rgba(26,46,43,0.12)] rounded-full p-1.5 flex items-center gap-1 overflow-hidden"
      >
        {tabs.map((tab) => {
          const isActive = activePage === tab.id;
          const Icon = tab.Icon;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onPageSelect(tab.id)}
              type="button"
              animate={{
                backgroundColor: isActive ? '#2A7A78' : 'rgba(0, 0, 0, 0)',
                color: isActive ? '#ffffff' : '#5C736F',
                paddingLeft: isActive ? 16 : 12,
                paddingRight: isActive ? 16 : 12,
                boxShadow: isActive
                  ? '0px 4px 16px rgba(42, 122, 120, 0.38)'
                  : '0px 0px 0px rgba(0, 0, 0, 0)',
              }}
              transition={springTransition}
              className="relative h-11 rounded-full flex items-center justify-center cursor-pointer select-none overflow-hidden active:scale-95 hover:text-text-primary"
              aria-label={tab.label}
            >
              <div className="flex items-center">
                <Icon
                  weight={isActive ? 'bold' : 'regular'}
                  size={tab.id === 1 ? 21 : 20}
                  className="flex-shrink-0"
                />

                <motion.span
                  initial={false}
                  animate={{
                    maxWidth: isActive ? 72 : 0,
                    opacity: isActive ? 1 : 0,
                    marginLeft: isActive ? 7 : 0,
                  }}
                  transition={springTransition}
                  className="overflow-hidden whitespace-nowrap text-[13px] font-bold tracking-tight inline-block"
                >
                  {tab.label}
                </motion.span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </nav>
  );
}
