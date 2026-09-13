import Link from "next/link";
import { MapPin } from "lucide-react";
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
        "group flex cursor-pointer flex-col rounded-2xl border border-border bg-surface p-6",
        "transition-[border-color,transform] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "hover:border-primary/30 motion-safe:hover:-translate-y-1",
        isHighlighted && "border-primary/30 ring-2 ring-primary/20",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex items-start gap-4">
          <CompanyMark company={company} size="md" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-medium text-foreground">
              {company.name}
            </h3>
            {company.location ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
                <MapPin size={12} aria-hidden />
                {company.location}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          {fleetHint ? (
            <p className="min-w-0 truncate text-sm text-muted-foreground">{fleetHint}</p>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-sm font-medium text-primary transition-colors group-hover:text-primary-hover">
            {viewFleetLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
