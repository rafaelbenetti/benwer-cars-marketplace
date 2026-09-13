"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NavRoutes } from "@/enums";
import { cn } from "@/lib/utils";

const FLEET_HREF = `${NavRoutes.HOME}#fleet`;

export function TenantNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === NavRoutes.HOME;

  const links = [
    {
      href: NavRoutes.HOME,
      label: t("home"),
      isActive: isHome,
    },
    {
      href: FLEET_HREF,
      label: t("cars"),
      isActive: pathname.startsWith("/cars") || pathname.startsWith("/book"),
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
            "inline-flex cursor-pointer items-center rounded-full px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            link.href === NavRoutes.HOME && "max-sm:hidden",
            link.isActive
              ? "bg-primary/10 font-medium text-primary"
              : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
