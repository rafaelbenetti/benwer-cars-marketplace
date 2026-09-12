import Link from "next/link";
import { MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import {
  FEATURED_CITY_SLUGS,
  getCityBySlug,
  getCityDisplayName,
} from "@/data/malagaCities";
import { buildCompaniesSearchHref } from "@/lib/marketplaceSearch";
import { EmptyState } from "@/components/ui/EmptyState";

export async function BrowseByLocation() {
  const t = await getTranslations("browseLocation");
  const locale = await getLocale();

  const cities = FEATURED_CITY_SLUGS.flatMap((slug) => {
    const city = getCityBySlug(slug);
    return city ? [city] : [];
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      {cities.length === 0 ? (
        <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {cities.map((city) => {
            const name = getCityDisplayName(city, locale);
            return (
              <Link
                key={city.slug}
                href={buildCompaniesSearchHref({ location: city.slug })}
                aria-label={t("cityAria", { city: name })}
                className="group flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-safe:hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-base font-semibold text-foreground">
                    {name}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {t("region")}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
