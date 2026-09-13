import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { NavRoutes } from "@/enums";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { TenantNav } from "./TenantNav";

interface TenantHeaderProps {
  companyName: string;
  logoUrl?: string | null;
  className?: string;
}

export async function TenantHeader({
  companyName,
  logoUrl,
  className,
}: TenantHeaderProps) {
  const t = await getTranslations("tenant");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-primary/5 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
        <Link
          href={NavRoutes.HOME}
          className="flex min-w-0 items-center gap-2.5 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <TenantMark companyName={companyName} logoUrl={logoUrl} logoAlt={t("logoAlt", { name: companyName })} />
          <span className="truncate text-sm font-semibold tracking-tight">
            {companyName}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <TenantNav />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}

function TenantMark({
  companyName,
  logoUrl,
  logoAlt,
}: {
  companyName: string;
  logoUrl?: string | null;
  logoAlt: string;
}) {
  if (logoUrl) {
    return (
      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
        <Image
          src={logoUrl}
          alt={logoAlt}
          fill
          unoptimized
          className="object-contain p-0.5"
          sizes="32px"
        />
      </span>
    );
  }

  const initial = companyName.trim().charAt(0).toUpperCase() || "?";

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
      {initial}
    </span>
  );
}
