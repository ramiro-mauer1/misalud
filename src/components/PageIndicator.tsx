import { motion } from 'framer-motion';

export interface PageIndicatorProps {
  totalPages: number;
  activePage: number;
  onPageSelect: (page: number) => void;
}

export function PageIndicator({ totalPages, activePage, onPageSelect }: PageIndicatorProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,8px)]">
      <div className="flex items-center justify-center gap-2 py-3 bg-canvas/80 backdrop-blur-sm">
        {pages.map((pageIndex) => {
          const isActive = pageIndex === activePage;
          return (
            <div
              key={pageIndex}
              onClick={() => onPageSelect(pageIndex)}
              className="relative cursor-pointer flex items-center justify-center h-1.5"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  isActive ? 'bg-transparent' : 'bg-accent-sage/40'
                }`}
              />
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute w-6 h-1.5 rounded-full bg-accent-teal"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
