import Link from "next/link";
import { ChevronRight, MapPinned } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import {
  FEATURED_CITY_SLUGS,
  getCityBySlug,
  getCityDisplayName,
} from "@/data/malagaCities";
import {
  buildCompaniesMapHref,
  buildCompaniesSearchHref,
} from "@/lib/marketplaceSearch";

export async function MarketplaceMapTeaser() {
  const t = await getTranslations("map");
  const locale = await getLocale();

  const cities = FEATURED_CITY_SLUGS.flatMap((slug) => {
    const city = getCityBySlug(slug);
    return city ? [city] : [];
  });

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-center gap-4 px-5 py-8 md:px-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPinned size={20} aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">{t("teaserTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("teaserSubtitle")}</p>
          </div>
          <Link
            href={buildCompaniesMapHref()}
            className="inline-flex w-fit cursor-pointer items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("teaserCta")}
            <ChevronRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="relative border-t border-border bg-primary/5 p-5 md:p-8 lg:border-t-0 lg:border-l">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
          />
          <ul className="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cities.map((city) => {
              const name = getCityDisplayName(city, locale);
              return (
                <li key={city.slug}>
                  <Link
                    href={buildCompaniesSearchHref({
                      location: city.slug,
                      view: "map",
                    })}
                    aria-label={t("teaserCityAria", { city: name })}
                    className="group flex h-full cursor-pointer flex-col gap-2 rounded-xl border border-border bg-surface px-3 py-3 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-safe:hover:shadow-md"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <MapPinned size={14} aria-hidden />
                    </span>
                    <span className="truncate text-sm font-semibold text-foreground">
                      {name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
