"use client";

import { Building2, CarFront, MapPin, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompanies } from "@/hooks/useCompanies";
import { useMarketplaceVehicles } from "@/hooks/useMarketplaceVehicles";
import { deriveMarketplaceTrustStats } from "@/lib/marketplaceTrust";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export function TrustStats() {
  const t = useTranslations("trustStats");
  const companiesQuery = useCompanies();
  const vehiclesQuery = useMarketplaceVehicles({});
  const isPending = companiesQuery.isPending || vehiclesQuery.isPending;
  const hasCatalogue = Boolean(companiesQuery.data || vehiclesQuery.data);
  const isError =
    (companiesQuery.isError || vehiclesQuery.isError) && !hasCatalogue;

  if (isPending) {
    return (
      <section aria-busy="true" className="rounded-xl border border-border bg-surface px-4 py-4 md:px-6">
        <Skeleton className="mb-3 h-4 w-40" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <ErrorState
        className="py-8"
        message={t("error")}
        onRetry={() => {
          void companiesQuery.refetch();
          void vehiclesQuery.refetch();
        }}
      />
    );
  }

  const stats = deriveMarketplaceTrustStats(companiesQuery.data, vehiclesQuery.data);
  if (stats.companyCount === 0 && stats.carCount === 0) {
    return null;
  }

  const locationValue =
    stats.locationCount > 0
      ? t("locations", { count: stats.locationCount })
      : t("area");

  return (
    <section className="rounded-xl border border-border bg-surface px-4 py-4 md:px-6">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-sm font-semibold text-foreground">{t("title")}</h2>
        <p className="text-xs text-muted-foreground">{t("source")}</p>
      </div>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-label={t("title")}>
        <TrustStat icon={Building2} value={t("companies", { count: stats.companyCount })} />
        <TrustStat icon={CarFront} value={t("cars", { count: stats.carCount })} />
        <TrustStat icon={MapPin} value={locationValue} />
        <TrustStat icon={ShieldCheck} value={t("noAccount")} />
      </ul>
    </section>
  );
}

function TrustStat({
  icon: Icon,
  value,
}: {
  icon: typeof Building2;
  value: string;
}) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={16} aria-hidden />
      </span>
      <p className="text-sm font-semibold tabular-nums text-foreground">{value}</p>
    </li>
  );
}
