"use client";

import { useId, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AccordionItemProps = {
  title: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
  buttonClassName?: string;
  /** Applied to the inner padding wrapper so height animates cleanly. */
  panelClassName?: string;
  iconClassName?: string;
};

/**
 * Accessible disclosure with a smooth height + fade animation.
 * Padding lives on an inner wrapper so the height tween never jumps.
 */
export function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
  className,
  buttonClassName,
  panelClassName,
  iconClassName,
}: AccordionItemProps) {
  const id = useId();
  const buttonId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <div className={className}>
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn("group w-full cursor-pointer", buttonClassName)}
      >
        <span>{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.45, ease: EASE.out }}
          className={cn(
            "shrink-0 inline-flex items-center justify-center",
            iconClassName
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.5, ease: EASE.out },
                opacity: { duration: 0.35, delay: 0.08 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.38, ease: EASE.inOut },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className={panelClassName}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
