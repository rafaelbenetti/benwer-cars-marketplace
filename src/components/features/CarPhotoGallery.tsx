"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/Button";

interface CarPhotoGalleryProps {
  photos: string[];
  alt: string;
  className?: string;
}

export function CarPhotoGallery({ photos, alt, className }: CarPhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div
        className={cn(
          "relative aspect-[16/9] rounded-xl overflow-hidden bg-surface-muted flex items-center justify-center",
          className,
        )}
      >
        <svg
          className="h-16 w-16 text-subtle-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </svg>
      </div>
    );
  }

  const activePhoto = photos[activeIndex];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-surface-muted group">
        {activePhoto ? (
          <Image
            src={activePhoto}
            alt={`${alt} — photo ${activeIndex + 1}`}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
        ) : null}

        {photos.length > 1 ? (
          <>
            <IconButton
              label="Previous photo"
              onClick={() => setActiveIndex((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} aria-hidden />
            </IconButton>
            <IconButton
              label="Next photo"
              onClick={() => setActiveIndex((i) => (i + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} aria-hidden />
            </IconButton>
            <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2 py-0.5 text-xs tabular-nums text-foreground">
              {activeIndex + 1} / {photos.length}
            </span>
          </>
        ) : null}
      </div>

      {photos.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={i === activeIndex}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors cursor-pointer",
                i === activeIndex
                  ? "border-primary"
                  : "border-transparent hover:border-border-strong",
              )}
            >
              <Image
                src={photo}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
