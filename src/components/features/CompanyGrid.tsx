"use client";

import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { CompanyCard } from "./CompanyCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import { getErrorKey } from "@/lib/errors";
import { NavRoutes } from "@/enums";
import { buildCompanyHref } from "@/lib/marketplaceSearch";
import type { Company } from "@/types/company";

interface CompanyGridProps {
  companies: Company[];
  buildHref?: (company: Company) => string;
  selectedSlug?: string | null;
  onHighlight?: (slug: string | null) => void;
  fleetHint?: (company: Company) => string;
  viewFleetLabel?: string;
  onClearFilters?: () => void;
  emptyTitle?: string;
  emptyHint?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
  className?: string;
}

export function CompanyGrid({
  companies,
  buildHref,
  selectedSlug,
  onHighlight,
  fleetHint,
  viewFleetLabel,
  onClearFilters,
  emptyTitle,
  emptyHint,
  emptyActionLabel,
  emptyActionHref,
  className,
}: CompanyGridProps) {
  const t = useTranslations("companies");
  const tMap = useTranslations("map");

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={<Building2 size={28} />}
        title={emptyTitle ?? (onClearFilters ? t("noResults") : t("emptyTitle"))}
        description={
          emptyHint ?? (onClearFilters ? t("noResultsHint") : t("emptyDescription"))
        }
        actionLabel={
          emptyActionLabel ?? (onClearFilters ? t("clearFilters") : t("browseCars"))
        }
        onAction={onClearFilters}
        actionHref={onClearFilters ? undefined : (emptyActionHref ?? NavRoutes.CARS)}
      />
    );
  }

  function defaultFleetHint(company: Company): string {
    return company.vehicleCount == null
      ? tMap("fleetHintUnknown")
      : tMap("fleetHint", { count: company.vehicleCount });
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
          href={buildHref?.(company) ?? buildCompanyHref(company.slug)}
          viewFleetLabel={viewFleetLabel ?? t("viewFleet")}
          fleetHint={(fleetHint ?? defaultFleetHint)(company)}
          isHighlighted={selectedSlug === company.slug}
          onHighlight={onHighlight}
        />
      ))}
    </div>
  );
}

export function CompanyGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border bg-surface"
        >
          <Skeleton className="h-1.5 w-full rounded-none" />
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-24 rounded-md" />
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
  emptyTitle?: string;
  emptyHint?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
}

export function CompanyGridView({
  companies,
  isPending,
  isError,
  error,
  onRetry,
  emptyTitle,
  emptyHint,
  emptyActionLabel,
  emptyActionHref,
}: CompanyGridViewProps) {
  const t = useTranslations();

  if (isPending) return <CompanyGridSkeleton />;
  if (isError) {
    return <ErrorState message={t(getErrorKey(error))} onRetry={onRetry} />;
  }
  return (
    <CompanyGrid
      companies={companies ?? []}
      emptyTitle={emptyTitle}
      emptyHint={emptyHint}
      emptyActionLabel={emptyActionLabel}
      emptyActionHref={emptyActionHref}
    />
  );
}
