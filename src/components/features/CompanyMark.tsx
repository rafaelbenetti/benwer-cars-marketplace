import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";

interface CompanyMarkProps {
  company: Pick<Company, "name" | "branding">;
  size?: "sm" | "md";
  className?: string;
}

const SIZE_CLASS = {
  sm: "h-5 w-5 rounded-md text-[10px]",
  md: "h-12 w-12 rounded-xl text-lg",
} as const;

export function CompanyMark({
  company,
  size = "md",
  className,
}: CompanyMarkProps) {
  const initial = company.name.trim().charAt(0).toUpperCase() || "?";

  if (company.branding.logoUrl) {
    return (
      <span
        className={cn(
          "relative shrink-0 overflow-hidden border border-border bg-surface",
          SIZE_CLASS[size],
          className,
        )}
      >
        <Image
          src={company.branding.logoUrl}
          alt=""
          fill
          unoptimized
          className="object-contain p-0.5"
          sizes={size === "sm" ? "20px" : "48px"}
        />
      </span>
    );
  }

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
