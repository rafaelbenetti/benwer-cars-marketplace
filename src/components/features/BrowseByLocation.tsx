import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import {
  FEATURED_CITY_SLUGS,
  getCityBySlug,
  getCityDisplayName,
} from "@/data/malagaCities";
import { buildCompaniesSearchHref } from "@/lib/marketplaceSearch";

export async function BrowseByLocation() {
  const t = await getTranslations("browseLocation");
  const locale = await getLocale();

  const cities = FEATURED_CITY_SLUGS.flatMap((slug) => {
    const city = getCityBySlug(slug);
    return city ? [city] : [];
  });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
      <div className="flex flex-wrap gap-2">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={buildCompaniesSearchHref({ location: city.slug })}
            className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {getCityDisplayName(city, locale)}
          </Link>
        ))}
      </div>
    </section>
  );
}
