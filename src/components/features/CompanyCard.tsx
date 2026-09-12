import Link from "next/link";
import { MapPin, Car } from "lucide-react";
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
        "group flex cursor-pointer flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition-shadow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "motion-safe:hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Car size={20} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
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
      </div>

      {company.description ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {company.description}
        </p>
      ) : null}

      <span className="inline-flex h-8 w-fit items-center justify-center rounded-md border border-border bg-surface px-3 text-xs font-medium text-foreground transition-colors group-hover:bg-surface-hover">
        {viewFleetLabel}
      </span>
    </Link>
  );
}
