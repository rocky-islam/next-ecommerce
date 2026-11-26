"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#050505] text-neutral-300 text-[10.5px] font-bold tracking-[0.2em] uppercase py-2 px-4 border-b border-neutral-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center truncate">
          <span>
            SS/26 RELEASE • COMPLIMENTARY 64-DISTRICT SHIPPING OVER ৳2,500 • 7-DAY SIZE EXCHANGE
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-neutral-500 hover:text-white p-1 ml-2 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
