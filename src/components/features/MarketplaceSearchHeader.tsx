import { BadgeCheck, MapPin, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeroSearch } from "./MarketplaceHeroSearch";

export async function MarketplaceSearchHeader() {
  const t = await getTranslations("home");

  return (
    <>
      <section className="marketplace-search-hero relative w-full overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-info/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-20 md:px-6 md:pt-20 md:pb-28 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="marketplace-search-hero-title mt-3 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="marketplace-search-hero-subtitle mt-4 max-w-xl text-sm md:text-base">
            {t("subtitle")}
          </p>
          <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <li className="marketplace-search-hero-subtitle flex items-center gap-2 text-sm">
              <BadgeCheck size={16} className="text-primary" aria-hidden />
              {t("trustLocal")}
            </li>
            <li className="marketplace-search-hero-subtitle flex items-center gap-2 text-sm">
              <UserRound size={16} className="text-primary" aria-hidden />
              {t("trustGuest")}
            </li>
            <li className="marketplace-search-hero-subtitle flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-primary" aria-hidden />
              {t("trustArea")}
            </li>
          </ul>
        </div>
      </section>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="-mt-12 md:-mt-14">
          <MarketplaceHeroSearch />
        </div>
      </div>
    </>
  );
}
