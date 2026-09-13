"use client";

import Link from "next/link";
import Image from "next/image";
import { Bike, Bus, Car, CarFront, ChevronRight, Fuel, Truck, Users, Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { CompanyMark } from "./CompanyMark";
import type { Company } from "@/types/company";
import type { Vehicle } from "@/types/vehicle";
import { FuelType, TransmissionType, VehicleType } from "@/enums";

interface CarCardProps {
  vehicle: Vehicle;
  href: string;
  company?: Pick<Company, "name" | "slug" | "branding"> | null;
  priority?: boolean;
  className?: string;
}

const FALLBACK_TONE: Record<VehicleType, string> = {
  [VehicleType.CAR]: "bg-primary/5",
  [VehicleType.SUV]: "bg-info-soft",
  [VehicleType.VAN]: "bg-warning-soft",
  [VehicleType.TRUCK]: "bg-surface-muted",
  [VehicleType.MOTORCYCLE]: "bg-success-soft",
};

const FALLBACK_ICON = {
  [VehicleType.CAR]: Car,
  [VehicleType.SUV]: CarFront,
  [VehicleType.VAN]: Bus,
  [VehicleType.TRUCK]: Truck,
  [VehicleType.MOTORCYCLE]: Bike,
} as const;

export function CarCard({
  vehicle,
  href,
  company,
  priority = false,
  className,
}: CarCardProps) {
  const t = useTranslations("cars");
  const tDetail = useTranslations("carDetail");
  const locale = useLocale();
  const primaryPhoto = vehicle.photos[0];
  const name = `${vehicle.brand} ${vehicle.model}`;

  return (
    <Link
      href={href}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface",
        "transition-[box-shadow,transform] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-200 motion-safe:group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
          />
        ) : (
          <CarPhotoFallback type={vehicle.type} emptyLabel={tDetail("photoEmpty")} />
        )}
        <Badge
          variant="default"
          className="absolute left-3 top-3 border border-border bg-surface/90 backdrop-blur-sm"
        >
          {t(`types.${vehicle.type}`)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight text-foreground">{name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {vehicle.year} &middot; {t(`types.${vehicle.type}`)}
          </p>
          {company ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CompanyMark company={company} size="sm" />
              <span className="truncate font-medium text-foreground">{company.name}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="gap-1">
            <Users size={12} aria-hidden />
            {t("seats", { count: vehicle.seats })}
          </Badge>
          <Badge variant="default">
            {t(
              vehicle.transmission === TransmissionType.AUTOMATIC
                ? "transmission.automatic"
                : "transmission.manual",
            )}
          </Badge>
          <FuelBadge fuel={vehicle.fuel} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <p className="leading-none">
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {formatPrice(vehicle.pricePerDay, vehicle.currency, locale)}
            </span>
            <span className="text-sm text-muted-foreground">{t("perDaySuffix")}</span>
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t("viewDetails")}
            <ChevronRight
              size={16}
              aria-hidden
              className="transition-transform motion-safe:group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CarPhotoFallback({
  type,
  emptyLabel,
}: {
  type: VehicleType;
  emptyLabel: string;
}) {
  const Icon = FALLBACK_ICON[type];

  return (
    <div
      className={cn(
        "car-photo-fallback relative flex h-full flex-col items-center justify-center px-4",
        FALLBACK_TONE[type],
      )}
    >
      <Icon
        size={88}
        aria-hidden
        className="relative z-10 text-primary/20"
        strokeWidth={1.25}
      />
      <p className="absolute inset-x-3 bottom-3 z-10 text-center text-xs font-medium text-muted-foreground">
        {emptyLabel}
      </p>
    </div>
  );
}

function FuelBadge({ fuel }: { fuel: FuelType }) {
  const t = useTranslations("cars");

  if (fuel === FuelType.ELECTRIC) {
    return (
      <Badge variant="success" className="gap-1">
        <Zap size={12} aria-hidden />
        {t("fuel.electric")}
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="gap-1">
      <Fuel size={12} aria-hidden />
      {t(`fuel.${fuel}`)}
    </Badge>
  );
}

function formatPrice(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale === "es-ES" ? "es-ES" : "en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
