"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NavRoutes } from "@/enums";
import { cn } from "@/lib/utils";

export function MarketplaceNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    {
      href: NavRoutes.HOME,
      label: t("home"),
      isActive: pathname === NavRoutes.HOME,
      className: "hidden sm:inline-flex",
    },
    {
      href: NavRoutes.COMPANIES,
      label: t("companies"),
      isActive: pathname.startsWith(NavRoutes.COMPANIES),
      className: undefined,
    },
  ];

  return (
    <nav className="flex items-center gap-1" aria-label={t("mainAria")}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={link.isActive ? "page" : undefined}
          className={cn(
            "inline-flex cursor-pointer items-center rounded-full px-3 py-1.5 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            link.isActive
              ? "bg-surface-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
            link.className,
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
