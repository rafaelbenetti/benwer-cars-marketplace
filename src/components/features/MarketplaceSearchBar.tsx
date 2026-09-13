"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { CityCombobox } from "./CityCombobox";
import { DateRangePopover } from "./DateRangePopover";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { DEFAULT_CITY_SLUG, resolveCitySlug } from "@/data/malagaCities";
import { SearchParams } from "@/enums";
import { buildCompaniesSearchHref } from "@/lib/marketplaceSearch";
import { cn } from "@/lib/utils";

interface MarketplaceSearchBarProps {
  className?: string;
}

function MarketplaceSearchForm({
  className,
  initialLocation,
  initialFrom,
  initialTo,
  view,
}: MarketplaceSearchBarProps & {
  initialLocation: string;
  initialFrom: string;
  initialTo: string;
  view?: string;
}) {
  const t = useTranslations("search");
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(
      buildCompaniesSearchHref({
        location: location || DEFAULT_CITY_SLUG,
        from,
        to,
        view,
      }),
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full rounded-2xl border border-border bg-surface p-2 shadow-md md:p-2.5",
        className,
      )}
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-stretch md:gap-0">
        <div className="min-w-0 md:flex-1">
          <CityCombobox value={location} onChange={setLocation} />
        </div>
        <div
          aria-hidden
          className="bg-border h-px w-full md:mx-0 md:my-1.5 md:h-auto md:w-px md:self-stretch"
        />
        <DateRangePopover
          from={from}
          to={to}
          onChange={(next) => {
            setFrom(next.from);
            setTo(next.to);
          }}
        />
        <div className="md:ml-1.5 md:self-center">
          <Button type="submit" size="lg" className="h-11 w-full shrink-0 md:min-w-28 md:w-auto">
            <Search size={16} aria-hidden />
            {t("submit")}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function MarketplaceSearchBar({ className }: MarketplaceSearchBarProps) {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get(SearchParams.LOCATION);
  const fromParam = searchParams.get(SearchParams.FROM) ?? "";
  const toParam = searchParams.get(SearchParams.TO) ?? "";
  const viewParam = searchParams.get(SearchParams.VIEW) ?? "";

  return (
    <MarketplaceSearchForm
      key={`${locationParam ?? ""}|${fromParam}|${toParam}|${viewParam}`}
      className={className}
      initialLocation={resolveCitySlug(locationParam)}
      initialFrom={fromParam}
      initialTo={toParam}
      view={viewParam || undefined}
    />
  );
}

export function MarketplaceSearchBarFallback({ className }: MarketplaceSearchBarProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-surface p-2 shadow-md md:p-2.5",
        className,
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Skeleton className="h-11 w-full md:flex-1" />
        <Skeleton className="h-11 w-full md:flex-1" />
        <Skeleton className="h-11 w-full md:flex-1" />
        <Skeleton className="h-11 w-full md:w-28" />
      </div>
    </div>
  );
}
