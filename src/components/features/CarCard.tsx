import Link from "next/link";
import Image from "next/image";
import { Users, Fuel, Zap } from "lucide-react";
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
  const primaryPhoto = vehicle.photos[0];

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-surface overflow-hidden transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="relative aspect-[4/3] bg-surface-muted">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-12 w-12 text-subtle-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          <p className="text-base font-semibold text-foreground leading-tight">
            {vehicle.brand} {vehicle.model}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {vehicle.year} &middot; {formatType(vehicle.type)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="gap-1">
            <Users size={12} aria-hidden />
            {vehicle.seats}
          </Badge>
          <Badge variant="default">
            {vehicle.transmission === TransmissionType.AUTOMATIC ? "Auto" : "Manual"}
          </Badge>
          <FuelBadge fuel={vehicle.fuel} />
        </div>

        <div className="flex items-baseline gap-1 pt-1 border-t border-border">
          <span className="text-lg font-semibold tabular-nums text-foreground">
            {formatPrice(vehicle.pricePerDay, vehicle.currency)}
          </span>
          <span className="text-xs text-muted-foreground">/ day</span>
        </div>
      </div>
    </Link>
  );
}

function FuelBadge({ fuel }: { fuel: FuelType }) {
  if (fuel === FuelType.ELECTRIC) {
    return (
      <Badge variant="success" className="gap-1">
        <Zap size={12} aria-hidden />
        Electric
      </Badge>
    );
  }
  return (
    <Badge variant="default" className="gap-1">
      <Fuel size={12} aria-hidden />
      {formatFuel(fuel)}
    </Badge>
  );
}

function formatType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatFuel(fuel: FuelType): string {
  const map: Record<FuelType, string> = {
    [FuelType.PETROL]: "Petrol",
    [FuelType.DIESEL]: "Diesel",
    [FuelType.ELECTRIC]: "Electric",
    [FuelType.HYBRID]: "Hybrid",
  };
  return map[fuel] ?? fuel;
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
