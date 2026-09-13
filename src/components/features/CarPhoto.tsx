"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

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

  const unoptimized =
    src.startsWith("/localstack/") ||
    /^https?:\/\/(?:localhost|127\.0\.0\.1):4566\//i.test(src);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={unoptimized}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
