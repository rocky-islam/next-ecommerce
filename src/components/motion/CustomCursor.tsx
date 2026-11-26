"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";

type CursorState = "default" | "hover" | "label" | "text";

const INTERACTIVE = "a, button, [role='button'], summary, label, select, [data-cursor]";
const TEXT_INPUT = "input:not([type='checkbox']):not([type='radio']), textarea";

/**
 * Desktop-only cursor follower: a precise dot plus a springy ring that
 * swells over interactive elements and can show a short label
 * (`data-cursor-label="View"`). The native cursor stays visible, so
 * nothing about pointing accuracy or accessibility changes.
 */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  if (!fine || reduce) return null;
  return <CursorLayer />;
}

function CursorLayer() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const labelled = target.closest<HTMLElement>("[data-cursor-label]");
      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? "");
        setState("label");
        return;
      }
      if (target.closest(TEXT_INPUT)) setState("text");
      else if (target.closest(INTERACTIVE)) setState("hover");
      else setState("default");
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  const isLabel = state === "label" && !!label;
  const ringSize = state === "hover" ? 52 : state === "text" ? 6 : 34;
  const spring = { type: "spring", stiffness: 420, damping: 30, mass: 0.6 } as const;

  return (
    <>
      {/* Blended layer: inverts against whatever is underneath */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease" }}
      >
        <motion.div
          className="absolute left-0 top-0 rounded-full border border-white"
          style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
          animate={{
            width: ringSize,
            height: state === "text" ? 28 : ringSize,
            backgroundColor: state === "hover" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0)",
            scale: isLabel ? 0 : pressed ? 0.82 : 1,
            borderRadius: state === "text" ? 2 : 999,
          }}
          transition={spring}
        />
        <motion.div
          className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white"
          style={{ x, y, translateX: "-50%", translateY: "-50%" }}
          animate={{ scale: state === "default" ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Label bubble: solid so the text stays legible on any image */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease" }}
      >
        <motion.div
          className="absolute left-0 top-0 grid h-[84px] w-[84px] place-items-center rounded-full bg-neutral-950/90 text-white shadow-2xl backdrop-blur-sm"
          style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
          initial={false}
          animate={{ scale: isLabel ? (pressed ? 0.88 : 1) : 0, opacity: isLabel ? 1 : 0 }}
          transition={spring}
        >
          <AnimatePresence mode="wait">
            {isLabel && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
