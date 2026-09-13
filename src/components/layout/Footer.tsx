import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { NavRoutes } from "@/enums";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Footer() {
  const year = new Date().getFullYear();
  const tFooter = await getTranslations("footer");
  const tBrand = await getTranslations("brand");
  const tNav = await getTranslations("nav");

  return (
    <footer className="mt-auto w-full border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6 lg:px-8">
        <div className="flex max-w-xs flex-col gap-2">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {tBrand("name")}
          </p>
          <p className="text-sm text-muted-foreground">{tFooter("tagline")}</p>
          <p className="text-xs text-muted-foreground">{tFooter("trust")}</p>
          <p className="text-xs text-subtle-foreground">
            {tFooter("copyright", { year })}
          </p>
        </div>
        <nav className="flex items-center gap-4" aria-label={tNav("footerAria")}>
          <Link
            href={NavRoutes.HOME}
            className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {tNav("home")}
          </Link>
          <Link
            href={NavRoutes.COMPANIES}
            className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {tNav("companies")}
          </Link>
        </nav>
        <LocaleSwitcher />
      </div>
    </footer>
  );
}
