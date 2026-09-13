import { BadgeCheck, MapPin, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeroSearch } from "./MarketplaceHeroSearch";

export async function MarketplaceSearchHeader() {
  const t = await getTranslations("home");

  return (
    <>
      <section className="relative w-full overflow-hidden border-b border-border bg-primary/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-20 md:px-6 md:pt-20 md:pb-28 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            {t("subtitle")}
          </p>
          <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <li className="flex items-center gap-2 text-sm text-foreground">
              <BadgeCheck size={16} className="text-primary" aria-hidden />
              {t("trustLocal")}
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <UserRound size={16} className="text-primary" aria-hidden />
              {t("trustGuest")}
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <MapPin size={16} className="text-primary" aria-hidden />
              {t("trustArea")}
            </li>
          </ul>
        </div>
      </section>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="-mt-12 md:-mt-14">
          <MarketplaceHeroSearch className="shadow-md" />
        </div>
      </div>
    </>
  );
}
