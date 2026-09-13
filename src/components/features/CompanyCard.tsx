import Link from "next/link";
import { MapPin, Car, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";

interface CompanyCardProps {
  company: Company;
  href: string;
  viewFleetLabel: string;
  className?: string;
}

export function CompanyCard({
  company,
  href,
  viewFleetLabel,
  className,
}: CompanyCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "motion-safe:hover:shadow-md",
        className,
      )}
    >
      <div className="flex h-28 items-center justify-center bg-primary/5">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Car size={24} aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">
            {company.name}
          </p>
          {company.location ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} aria-hidden />
              {company.location}
            </p>
          ) : null}
        </div>

        {company.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {company.description}
          </p>
        ) : null}

        <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
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
