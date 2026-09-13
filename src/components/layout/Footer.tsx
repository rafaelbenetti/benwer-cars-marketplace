import Link from "next/link";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { NavRoutes } from "@/enums";
import { BrandLogo } from "./BrandLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Footer() {
  const year = new Date().getFullYear();
  const isTenant = Boolean((await headers()).get("x-company-slug"));
  const tFooter = await getTranslations("footer");
  const tBrand = await getTranslations("brand");
  const tNav = await getTranslations("nav");

  return (
    <footer className="mt-auto w-full border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6 lg:px-8">
        <div className="flex max-w-xs flex-col gap-3">
          <BrandLogo alt={tBrand("logoAlt")} variant="full" className="h-14 w-28" />
          <p className="text-sm text-muted-foreground">{tFooter("tagline")}</p>
          <p className="text-xs text-muted-foreground">
            {isTenant ? tFooter("poweredBy") : tFooter("trust")}
          </p>
          <p className="text-xs text-subtle-foreground">
            {tFooter("copyright", { year })}
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
          aria-label={tNav("footerAria")}
        >
          <FooterLink href={NavRoutes.HOME}>{tNav("home")}</FooterLink>
          {isTenant ? (
            <FooterLink href={`${NavRoutes.HOME}#fleet`}>{tNav("cars")}</FooterLink>
          ) : (
            <>
              <FooterLink href={NavRoutes.CARS}>{tNav("cars")}</FooterLink>
              <FooterLink href={NavRoutes.COMPANIES}>{tNav("companies")}</FooterLink>
            </>
          )}
        </nav>
        <LocaleSwitcher />
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {children}
    </Link>
  );
}
