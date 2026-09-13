import Image from "next/image";
import { cn } from "@/lib/utils";

const ASSETS = {
  full: {
    light: "/images/logo-black.webp",
    dark: "/images/logo-white.webp",
  },
  mark: {
    light: "/images/logo-sm-black.webp",
    dark: "/images/logo-sm-white.webp",
  },
} as const;

interface BrandLogoProps {
  alt: string;
  variant?: "full" | "mark";
  priority?: boolean;
  className?: string;
}

export function BrandLogo({
  alt,
  variant = "full",
  priority = false,
  className,
}: BrandLogoProps) {
  const sources = ASSETS[variant];
  const sizes = variant === "mark" ? "48px" : "160px";

  return (
    <span className={cn("relative inline-block", className)}>
      <Image
        src={sources.light}
        alt={alt}
        fill
        priority={priority}
        className="object-contain object-left dark:hidden"
        sizes={sizes}
      />
      <Image
        src={sources.dark}
        alt=""
        fill
        priority={priority}
        aria-hidden
        className="hidden object-contain object-left dark:block"
        sizes={sizes}
      />
    </span>
  );
}
