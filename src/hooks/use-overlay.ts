"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function focusables(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("inert") && el.getClientRects().length > 0
  );
}

/**
 * Modal overlay behaviour: locks page scroll, closes on Escape, moves focus
 * into the dialog, keeps Tab cycling inside it, and returns focus to the
 * control that opened it on close.
 *
 * Attach the returned ref to the dialog element.
 */
export function useOverlay<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onEscape: () => void
) {
  const ref = useRef<T>(null);
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus inside once the dialog has mounted, unless the dialog
    // already placed it (e.g. search focuses its input).
    const raf = requestAnimationFrame(() => {
      const root = ref.current;
      if (!root || root.contains(document.activeElement)) return;
      const preferred = root.querySelector<HTMLElement>("[data-autofocus]");
      const target = preferred ?? focusables(root)[0];
      if (target) {
        target.focus({ preventScroll: true });
      } else {
        if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");
        root.focus({ preventScroll: true });
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscapeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const root = ref.current;
      if (!root) return;
      const items = focusables(root);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const outside = !active || !root.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      // Return focus to the opener if it is still on the page.
      if (opener && opener.isConnected && typeof opener.focus === "function") {
        opener.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  return ref;
}
