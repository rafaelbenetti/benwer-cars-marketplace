"use client";

import { useState } from "react";
import Image from "next/image";
import { Car, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/Button";

interface CarPhotoGalleryProps {
  photos: string[];
  alt: string;
  className?: string;
}

export function CarPhotoGallery({ photos, alt, className }: CarPhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const t = useTranslations("carDetail");

  if (photos.length === 0) {
    return (
      <div
        className={cn(
          "relative flex aspect-[16/9] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-primary/5",
          className,
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Car size={28} aria-hidden />
        </span>
        <p className="text-sm font-medium text-foreground">{alt}</p>
        <p className="text-sm text-muted-foreground">{t("photoEmpty")}</p>
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
            alt={t("photoAlt", { name: alt, index: activeIndex + 1 })}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
        ) : null}

        {photos.length > 1 ? (
          <>
            <IconButton
              label={t("previousPhoto")}
              onClick={() => setActiveIndex((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} aria-hidden />
            </IconButton>
            <IconButton
              label={t("nextPhoto")}
              onClick={() => setActiveIndex((i) => (i + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} aria-hidden />
            </IconButton>
            <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2 py-0.5 text-xs tabular-nums text-foreground">
              {t("photoIndex", { current: activeIndex + 1, total: photos.length })}
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
              aria-label={t("viewPhoto", { index: i + 1 })}
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
