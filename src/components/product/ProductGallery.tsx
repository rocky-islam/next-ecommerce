"use client";

import { useEffect, useState, ViewTransition, type CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import { ShopifyImage } from "@/lib/shopify/types";
import { EASE, SPRING, toTransitionName } from "@/lib/motion";
import { useFinePointer } from "@/hooks/use-media-query";
import { useOverlay } from "@/hooks/use-overlay";

// Direction-aware slide: +1 = next (enter from right), -1 = previous
const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "8%" : "-8%", opacity: 0, scale: 1.04 }),
  center: { x: "0%", opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? "-8%" : "8%", opacity: 0, scale: 0.98 }),
};

const SWIPE_THRESHOLD = 60;

export function ProductGallery({
  images,
  title,
  selectedImage,
  handle,
}: {
  images: ShopifyImage[];
  title: string;
  selectedImage?: ShopifyImage | null;
  /** Product handle — names the main frame for the card → gallery morph. */
  handle?: string;
}) {
  // Combine images, ensuring selectedImage is included if not already in the array
  const allImages = [...images];
  if (selectedImage && !allImages.some((img) => img.url === selectedImage.url)) {
    allImages.unshift(selectedImage);
  }

  // React pattern for adjusting state during rendering when a prop changes
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);
  const [prevVariantUrl, setPrevVariantUrl] = useState(selectedImage?.url);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(1);
  const fine = useFinePointer();

  // If the variant image URL changes from outside (e.g. user selected another size/color),
  // reset clickedUrl so the new variant image is displayed
  if (selectedImage?.url !== prevVariantUrl) {
    setPrevVariantUrl(selectedImage?.url);
    setClickedUrl(null);
  }

  // Active image is the clicked thumbnail URL if user clicked one,
  // otherwise the selected variant image URL, otherwise the first image in array.
  const activeUrl = clickedUrl || selectedImage?.url || allImages[0]?.url;
  const activeIndex = Math.max(
    0,
    allImages.findIndex((img) => img.url === activeUrl)
  );
  const currentImage = allImages[activeIndex] || allImages[0];
  const hasMultiple = allImages.length > 1;

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setClickedUrl(allImages[index].url);
  };

  const handlePrev = () => {
    const prevIdx = activeIndex === 0 ? allImages.length - 1 : activeIndex - 1;
    setDirection(-1);
    setClickedUrl(allImages[prevIdx].url);
  };

  const handleNext = () => {
    const nextIdx = activeIndex === allImages.length - 1 ? 0 : activeIndex + 1;
    setDirection(1);
    setClickedUrl(allImages[nextIdx].url);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) handleNext();
    else if (info.offset.x > SWIPE_THRESHOLD) handlePrev();
  };

  // Lightbox: Escape closes, scroll locked, arrows navigate
  const dialogRef = useOverlay(isFullscreen, () => setIsFullscreen(false));
  useEffect(() => {
    if (!isFullscreen || !hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (allImages.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-neutral-100 flex items-center justify-center text-xs uppercase tracking-widest text-neutral-400 border border-neutral-200">
        No image available
      </div>
    );
  }

  const mainFrame = (
    <div
      className="relative aspect-square flex-1 w-full rounded-2xl overflow-hidden bg-[#F7F7F5] border border-neutral-200 group shadow-sm"
      onPointerMove={(e) => {
        if (!fine) return;
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--zx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        e.currentTarget.style.setProperty("--zy", `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentImage.url}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: EASE.out }}
          drag={hasMultiple && !fine ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 touch-pan-y"
        >
          {/* Hover zoom follows the cursor (desktop) — click opens the lightbox */}
          <div
            onClick={() => setIsFullscreen(true)}
            data-cursor-label="Expand"
            className={`relative w-full h-full ${
              fine
                ? "cursor-zoom-in transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.6]"
                : ""
            }`}
            style={{ transformOrigin: "var(--zx, 50%) var(--zy, 50%)" } as CSSProperties}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.altText || title}
              fill
              priority
              draggable={false}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover select-none"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Fullscreen view trigger button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => setIsFullscreen(true)}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity shadow-sm hover:bg-black hover:text-white cursor-pointer z-10"
        aria-label="View full screen"
      >
        <Maximize2 className="w-4 h-4" />
      </motion.button>

      {/* Counter Badge */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/75 backdrop-blur-sm text-white text-[11px] font-mono tracking-wider rounded-full pointer-events-none z-10 flex items-center gap-1">
          <span className="relative inline-flex overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.span
                key={activeIndex}
                custom={direction}
                initial={{ y: direction >= 0 ? "100%" : "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: direction >= 0 ? "-100%" : "100%" }}
                transition={{ duration: 0.4, ease: EASE.out }}
                className="inline-block"
              >
                {activeIndex + 1}
              </motion.span>
            </AnimatePresence>
          </span>
          <span>/ {allImages.length}</span>
        </div>
      )}

      {/* Prev/Next arrows on main image */}
      {hasMultiple && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-neutral-800 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black hover:text-white shadow-sm cursor-pointer z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-neutral-800 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black hover:text-white shadow-sm cursor-pointer z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 items-start">
        {/* Thumbnails (vertical on desktop, horizontal on mobile) */}
        {hasMultiple && (
          <div
            data-stagger="mount"
            style={{ "--d": "250ms", "--step": "60ms", "--ry": "12px" } as CSSProperties}
            className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar p-1 shrink-0 w-full lg:w-[5.5rem] max-h-[580px]"
          >
            {allImages.map((img, index) => {
              const isSelected = index === activeIndex;

              return (
                <motion.button
                  key={`${img.url}-${index}`}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={isSelected ? "true" : undefined}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neutral-100 shrink-0 transition-opacity duration-300 cursor-pointer ${
                    isSelected ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${index + 1} of ${title}`}
                >
                  <span className="absolute inset-0 rounded-xl overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.altText || `${title} thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </span>
                  {/* Active ring glides between thumbnails */}
                  {isSelected && (
                    <motion.span
                      layoutId="gallery-thumb-ring"
                      transition={SPRING.glide}
                      className="absolute -inset-0.5 rounded-[14px] border-2 border-black shadow-md pointer-events-none"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Main Display Image (morph target for the product card) */}
        {handle ? (
          <ViewTransition
            name={toTransitionName("product-image", handle)}
            share="product-morph"
            default="none"
          >
            {mainFrame}
          </ViewTransition>
        ) : (
          mainFrame
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — image viewer`}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 outline-none"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 text-white text-xs font-mono tracking-widest px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer z-10"
            >
              CLOSE [ESC]
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE.out }}
              className="relative w-full max-w-4xl aspect-square max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentImage.url}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: EASE.out }}
                  drag={hasMultiple ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentImage.url}
                    alt={currentImage.altText || title}
                    fill
                    draggable={false}
                    sizes="100vw"
                    className="object-contain select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {hasMultiple && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <span className="text-white text-xs font-mono tracking-widest">
                  {activeIndex + 1} / {allImages.length}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
