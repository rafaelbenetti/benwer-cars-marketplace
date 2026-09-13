"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";

interface CompanyMarkProps {
  company: Pick<Company, "name" | "branding">;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS = {
  sm: "h-7 w-7 rounded-lg text-[11px]",
  md: "h-12 w-12 rounded-xl text-lg",
  lg: "h-14 w-14 rounded-xl text-xl",
} as const;

const SIZE_PX = {
  sm: 28,
  md: 48,
  lg: 56,
} as const;

export function CompanyMark({
  company,
  size = "md",
  className,
}: CompanyMarkProps) {
  const [failed, setFailed] = useState(false);
  const logoUrl = company.branding.logoUrl;

  if (logoUrl && !failed) {
    return (
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-border bg-surface",
          SIZE_CLASS[size],
          className,
        )}
      >
        <Image
          src={logoUrl}
          alt=""
          width={SIZE_PX[size]}
          height={SIZE_PX[size]}
          unoptimized
          className="h-full w-full object-contain p-0.5"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  const initial = company.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-primary/10 font-semibold text-primary",
        SIZE_CLASS[size],
        className,
      )}
    >
      {initial}
    </span>
  );
}
