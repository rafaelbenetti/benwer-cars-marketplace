"use client";

import Link from "next/link";
import Image from "next/image";
import { Car, Users, Fuel, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Vehicle } from "@/types/vehicle";
import { TransmissionType, FuelType } from "@/enums";

interface CarCardProps {
  vehicle: Vehicle;
  href: string;
  className?: string;
}

export function CarCard({ vehicle, href, className }: CarCardProps) {
  const t = useTranslations("cars");
  const primaryPhoto = vehicle.photos[0];

  return (
    <Link
      href={href}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "motion-safe:hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3] bg-primary/5">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover transition-transform duration-200 motion-safe:group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Car size={24} aria-hidden />
            </span>
            <p className="text-center text-sm font-medium text-foreground">
              {vehicle.brand} {vehicle.model}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-base font-semibold leading-tight text-foreground">
            {vehicle.brand} {vehicle.model}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {vehicle.year} &middot; {t(`types.${vehicle.type}`)}
          </p>
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

        <p className="mt-auto border-t border-border pt-3 text-lg font-semibold tabular-nums text-foreground">
          {t("perDay", {
            price: formatPrice(vehicle.pricePerDay, vehicle.currency),
          })}
        </p>
      </div>
    </Link>
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

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
