"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type ScrollRowProps = {
  children: ReactNode;
  className?: string;
  /** Classes for the scrolling track (flex, gap, padding...). */
  trackClassName?: string;
  /** Accessible name for the scroll region. */
  label?: string;
  /** CSS selector of the child to keep in view (e.g. the active pill). */
  activeSelector?: string;
  /** Re-run "scroll active into view" when this changes. */
  activeKey?: string;
  /** Show arrow buttons on hover-capable screens. */
  arrows?: boolean;
};

/**
 * Horizontal scroller that never hides content silently:
 * - edge fades appear only on the side(s) with more content,
 * - arrow buttons page through it on desktop,
 * - a vertical mouse wheel scrolls it sideways,
 * - the active item is scrolled into view.
 */
export function ScrollRow({
  children,
  className,
  trackClassName,
  label,
  activeSelector,
  activeKey,
  arrows = true,
}: ScrollRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    el.addEventListener("scroll", update, { passive: true });

    // Vertical wheel → horizontal scroll, only while there is room to move
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // let the page scroll
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
      el.removeEventListener("wheel", onWheel);
    };
  }, [update]);

  // Keep the active item visible (e.g. after choosing a filter)
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !activeSelector) return;
    const active = el.querySelector<HTMLElement>(activeSelector);
    if (!active) return;
    const target = active.offsetLeft - el.clientWidth / 2 + active.offsetWidth / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: "auto" });
    update();
  }, [activeSelector, activeKey, update]);

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className={cn("group/row relative", className)}>
      <div
        ref={trackRef}
        role={label ? "region" : undefined}
        aria-label={label}
        className={cn("scroll-row overflow-x-auto no-scrollbar overscroll-x-contain", trackClassName)}
        data-fade-left={canLeft || undefined}
        data-fade-right={canRight || undefined}
      >
        {children}
      </div>

      {arrows && (
        <>
          <AnimatePresence>
            {canLeft && (
              <motion.button
                key="left"
                type="button"
                aria-label="Scroll left"
                onClick={() => page(-1)}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:grid h-8 w-8 place-items-center rounded-full bg-white text-neutral-900 shadow-md ring-1 ring-neutral-200 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {canRight && (
              <motion.button
                key="right"
                type="button"
                aria-label="Scroll right"
                onClick={() => page(1)}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.25 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:grid h-8 w-8 place-items-center rounded-full bg-white text-neutral-900 shadow-md ring-1 ring-neutral-200 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
