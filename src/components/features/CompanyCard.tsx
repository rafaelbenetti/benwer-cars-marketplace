import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";

interface CompanyCardProps {
  company: Company;
  href: string;
  viewFleetLabel: string;
  fleetHint?: string;
  isHighlighted?: boolean;
  onHighlight?: (slug: string | null) => void;
  className?: string;
}

export function CompanyCard({
  company,
  href,
  viewFleetLabel,
  fleetHint,
  isHighlighted = false,
  onHighlight,
  className,
}: CompanyCardProps) {
  return (
    <Link
      id={`company-${company.slug}`}
      href={href}
      onMouseEnter={() => onHighlight?.(company.slug)}
      onMouseLeave={() => onHighlight?.(null)}
      onFocus={() => onHighlight?.(company.slug)}
      onBlur={() => onHighlight?.(null)}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface",
        "transition-[box-shadow,transform] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md",
        isHighlighted && "border-primary ring-2 ring-primary/30",
        className,
      )}
    >
      <div aria-hidden className="h-1.5 bg-primary/20" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <CompanyMark company={company} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">
              {company.name}
            </h3>
            {company.location ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} aria-hidden />
                {company.location}
              </p>
            ) : null}
          </div>
        </div>

        {fleetHint ? (
          <p className="text-sm text-muted-foreground">{fleetHint}</p>
        ) : null}

        <span className="mt-auto inline-flex h-8 w-fit items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors group-hover:bg-primary-hover">
          {viewFleetLabel}
          <ChevronRight
            size={16}
            aria-hidden
            className="transition-transform motion-safe:group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

function CompanyMark({ company }: { company: Company }) {
  const initial = company.name.trim().charAt(0).toUpperCase() || "?";

  if (company.branding.logoUrl) {
    return (
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
        <Image
          src={company.branding.logoUrl}
          alt=""
          fill
          unoptimized
          className="object-contain p-1"
          sizes="48px"
        />
      </span>
    );
  }

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary">
      {initial}
    </span>
  );
}
