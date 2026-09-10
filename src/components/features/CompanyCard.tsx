import Link from "next/link";
import { MapPin, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { Company } from "@/types/company";

interface CompanyCardProps {
  company: Company;
  href: string;
  className?: string;
}

export function CompanyCard({ company, href, className }: CompanyCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${company.branding.primaryColor}20` }}
        >
          <Car
            size={20}
            style={{ color: company.branding.primaryColor }}
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-foreground truncate">
            {company.name}
          </p>
          {company.location ? (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin size={12} aria-hidden />
              {company.location}
            </p>
          ) : null}
        </div>
      </div>

      {company.description ? (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {company.description}
        </p>
      ) : null}

      <Link
        href={href}
        className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-surface px-3 text-xs font-medium text-foreground hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        View fleet
      </Link>
    </div>
  );
}
