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
  className?: string;
  fallback: ReactNode;
}

export function CarPhoto({
  src,
  alt,
  sizes,
  priority = false,
  className,
  fallback,
}: CarPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return fallback;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={shouldSkipImageOptimization(src)}
      className={cn("absolute inset-0 size-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
