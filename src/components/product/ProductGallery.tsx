"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ShopifyImage } from "@/lib/shopify/types";

export function ProductGallery({
  images,
  title,
  selectedImage,
}: {
  images: ShopifyImage[];
  title: string;
  selectedImage?: ShopifyImage | null;
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

  // If the variant image URL changes from outside (e.g. user selected another size/color),
  // reset clickedUrl so the new variant image is displayed
  if (selectedImage?.url !== prevVariantUrl) {
    setPrevVariantUrl(selectedImage?.url);
    setClickedUrl(null);
  }

  if (allImages.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-neutral-100 flex items-center justify-center text-xs uppercase tracking-widest text-neutral-400 border border-neutral-200">
        No image available
      </div>
    );
  }

  // Active image is the clicked thumbnail URL if user clicked one,
  // otherwise the selected variant image URL, otherwise the first image in array.
  const activeUrl = clickedUrl || selectedImage?.url || allImages[0]?.url;
  const activeIndex = Math.max(
    0,
    allImages.findIndex((img) => img.url === activeUrl)
  );
  const currentImage = allImages[activeIndex] || allImages[0];

  const handlePrev = () => {
    const prevIdx = activeIndex === 0 ? allImages.length - 1 : activeIndex - 1;
    setClickedUrl(allImages[prevIdx].url);
  };

  const handleNext = () => {
    const nextIdx = activeIndex === allImages.length - 1 ? 0 : activeIndex + 1;
    setClickedUrl(allImages[nextIdx].url);
  };

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 items-start">
        {/* Thumbnails (vertical on desktop, horizontal on mobile) */}
        {allImages.length > 1 && (
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar py-1 shrink-0 w-full lg:w-20 max-h-[580px]">
            {allImages.map((img, index) => {
              const isSelected = img.url === currentImage.url;

              return (
                <motion.button
                  key={`${img.url}-${index}`}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => setClickedUrl(img.url)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-black shadow-md ring-2 ring-black/10 scale-102"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-neutral-300"
                  }`}
                  aria-label={`View image ${index + 1} of ${title}`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${title} thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Main Display Image */}
        <div className="relative aspect-square flex-1 w-full rounded-2xl overflow-hidden bg-[#F7F7F5] border border-neutral-200 group shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.url}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage.url}
                alt={currentImage.altText || title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Fullscreen view trigger button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-black hover:text-white cursor-pointer z-10"
            aria-label="View full screen"
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>

          {/* Counter Badge */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/75 backdrop-blur-sm text-white text-[11px] font-mono tracking-wider rounded-full pointer-events-none z-10">
              {activeIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Prev/Next arrows on main image */}
          {allImages.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-neutral-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white shadow-sm cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-neutral-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white shadow-sm cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal with smooth zoom animation */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 text-white text-xs font-mono tracking-widest px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              CLOSE [ESC]
            </button>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative w-full max-w-4xl aspect-square max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.altText || title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>

            {allImages.length > 1 && (
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
