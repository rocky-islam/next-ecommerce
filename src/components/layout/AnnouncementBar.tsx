"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          key="announcement"
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE.inOut }}
          className="overflow-hidden bg-[#050505] border-b border-neutral-900"
        >
          <div className="text-neutral-300 text-[10.5px] font-bold tracking-[0.2em] uppercase py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex-1 text-center truncate">
                <span className="bg-linear-to-r from-neutral-400 via-white to-neutral-400 bg-clip-text text-transparent animate-gradient-pan">
                  SS/26 RELEASE • COMPLIMENTARY 64-DISTRICT SHIPPING OVER ৳2,500 • 7-DAY SIZE EXCHANGE
                </span>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-neutral-500 hover:text-white hover:rotate-90 p-1 ml-2 transition-all duration-300 cursor-pointer"
                aria-label="Dismiss announcement"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
