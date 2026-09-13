"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { shouldSkipImageOptimization } from "@/lib/media";
import { cn } from "@/lib/utils";

interface CarPhotoProps {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  className?: string;
  fallback: ReactNode;
}

export function CarPhoto({
  src,
  alt,
  sizes,
  priority = false,
  fit = "cover",
  className,
  fallback,
}: CarPhotoProps) {
  const [failed, setFailed] = useState(false);
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(
    null,
  );

  if (!src || failed) {
    return fallback;
  }

  const unoptimized = shouldSkipImageOptimization(src);

  if (fit === "contain") {
    return (
      <Image
        src={src}
        alt={alt}
        width={natural?.width ?? 1600}
        height={natural?.height ?? 1000}
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        className={cn("h-auto w-auto max-h-full max-w-full object-contain", className)}
        style={
          natural
            ? { maxWidth: natural.width, maxHeight: natural.height }
            : undefined
        }
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            setNatural({
              width: image.naturalWidth,
              height: image.naturalHeight,
            });
          }
        }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={unoptimized}
      className={cn("absolute inset-0 size-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
