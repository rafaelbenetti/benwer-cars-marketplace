import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { CompanyMark } from "./CompanyMark";
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
        "group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        "transition-[box-shadow,transform] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-sm",
        isHighlighted && "border-primary ring-2 ring-primary/20",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <CompanyMark company={company} size="md" />
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
