import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, animate, useReducedMotion, PanInfo } from 'framer-motion';

export interface HorizontalPagerProps {
  children: React.ReactNode;
  page: number;
  onPageChange: (page: number) => void;
}

export function HorizontalPager({ children, page, onPageChange }: HorizontalPagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const childrenArray = React.Children.toArray(children);
  const totalPages = childrenArray.length;
  const x = useMotionValue(0);

  // Measure container width responsively
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(container);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Smoothly animate x when page or containerWidth changes
  useEffect(() => {
    if (containerWidth <= 0) return;
    const targetX = -page * containerWidth;

    if (shouldReduceMotion) {
      x.set(targetX);
    } else {
      animate(x, targetX, {
        type: 'spring',
        stiffness: 320,
        damping: 32,
        mass: 0.7,
      });
    }
  }, [page, containerWidth, shouldReduceMotion, x]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        onPageChange(Math.max(0, page - 1));
      } else if (e.key === 'ArrowRight') {
        onPageChange(Math.min(totalPages - 1, page + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, totalPages, onPageChange]);

  const handleDragEnd = useCallback((_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (containerWidth <= 0) return;

    const currentX = x.get();
    const pageOffset = currentX - (-page * containerWidth);
    const velocity = info.velocity.x;

    let targetPage = page;

    // Fast flick gesture detection
    if (velocity < -250) {
      targetPage = Math.min(totalPages - 1, page + 1);
    } else if (velocity > 250) {
      targetPage = Math.max(0, page - 1);
    } else {
      // 20% distance threshold
      if (pageOffset < -containerWidth * 0.2) {
        targetPage = Math.min(totalPages - 1, page + 1);
      } else if (pageOffset > containerWidth * 0.2) {
        targetPage = Math.max(0, page - 1);
      }
    }

    targetPage = Math.max(0, Math.min(totalPages - 1, targetPage));

    animate(x, -targetPage * containerWidth, {
      type: 'spring',
      stiffness: 320,
      damping: 32,
      mass: 0.7,
      velocity: info.velocity.x,
    });

    if (targetPage !== page) {
      onPageChange(targetPage);
    }
  }, [containerWidth, page, totalPages, x, onPageChange]);

  const maxDragLeft = -(totalPages - 1) * containerWidth;

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden select-none relative"
      style={{ overscrollBehavior: 'none' }}
    >
      {containerWidth > 0 && (
        <motion.div
          className="flex flex-row h-full will-change-transform cursor-grab active:cursor-grabbing"
          drag="x"
          dragDirectionLock
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={{
            left: maxDragLeft,
            right: 0,
          }}
          onDragEnd={handleDragEnd}
          style={{
            x,
            width: `${totalPages * 100}%`,
          }}
        >
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-full relative overflow-hidden"
              style={{
                width: containerWidth,
                touchAction: 'pan-y',
              }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
