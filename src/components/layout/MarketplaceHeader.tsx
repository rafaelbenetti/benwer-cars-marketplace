import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { NavRoutes } from "@/enums";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MarketplaceNav } from "./MarketplaceNav";

interface MarketplaceHeaderProps {
  className?: string;
}

export async function MarketplaceHeader({ className }: MarketplaceHeaderProps) {
  const t = await getTranslations("brand");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full overflow-x-clip border-b border-border bg-surface/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-3 md:px-6 lg:px-8">
        <Link
          href={NavRoutes.HOME}
          aria-label={t("homeAria")}
          className="flex min-w-0 items-center gap-2.5 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <BrandLogo
            alt={t("logoAlt")}
            variant="mark"
            priority
            className="h-8 w-12 shrink-0"
          />
          <span className="truncate text-sm font-semibold tracking-tight">
            <span className="sm:hidden">{t("shortName")}</span>
            <span className="hidden sm:inline">{t("name")}</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
          <MarketplaceNav />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
