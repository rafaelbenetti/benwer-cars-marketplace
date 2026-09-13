"use client";

import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { CompanyCard } from "./CompanyCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import { getErrorKey } from "@/lib/errors";
import type { Company } from "@/types/company";

interface CompanyGridProps {
  companies: Company[];
  className?: string;
}

export function CompanyGrid({ companies, className }: CompanyGridProps) {
  const t = useTranslations("companies");

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={<Building2 size={40} />}
        title={t("noResults")}
        description={t("noResultsHint")}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          href={`/companies/${company.slug}`}
          viewFleetLabel={t("viewFleet")}
        />
      ))}
    </div>
  );
}

export function CompanyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border bg-surface"
        >
          <Skeleton className="h-28 w-full rounded-none" />
          <div className="flex flex-col gap-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface CompanyGridViewProps {
  companies: Company[] | undefined;
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
}

export function CompanyGridView({
  companies,
  isPending,
  isError,
  error,
  onRetry,
}: CompanyGridViewProps) {
  const t = useTranslations();

  if (isPending) return <CompanyGridSkeleton />;
  if (isError) {
    return <ErrorState message={t(getErrorKey(error))} onRetry={onRetry} />;
  }
  return <CompanyGrid companies={companies ?? []} />;
}
