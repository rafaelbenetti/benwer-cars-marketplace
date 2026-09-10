"use client";

import { Building2 } from "lucide-react";
import { CompanyCard } from "./CompanyCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";

interface CompanyGridProps {
  companies: Company[];
  className?: string;
}

export function CompanyGrid({ companies, className }: CompanyGridProps) {
  if (companies.length === 0) {
    return (
      <EmptyState
        icon={<Building2 size={40} />}
        title="No companies found"
        description="Try adjusting your search."
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
        className,
      )}
    >
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          href={`/companies/${company.slug}`}
        />
      ))}
    </div>
  );
}

export function CompanyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

interface CompanyGridViewProps {
  companies: Company[] | undefined;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function CompanyGridView({
  companies,
  isPending,
  isError,
  onRetry,
}: CompanyGridViewProps) {
  if (isPending) return <CompanyGridSkeleton />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  return <CompanyGrid companies={companies ?? []} />;
}
