"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";
import { TransmissionType } from "@/enums";

interface CarSpecsTableProps {
  vehicle: Vehicle;
  className?: string;
}

export function CarSpecsTable({ vehicle, className }: CarSpecsTableProps) {
  const t = useTranslations("carDetail");
  const tCars = useTranslations("cars");

  const specs: { label: string; value: string }[] = [
    { label: t("year"), value: String(vehicle.year) },
    { label: t("type"), value: tCars(`types.${vehicle.type}`) },
    {
      label: t("transmission"),
      value: tCars(
        vehicle.transmission === TransmissionType.AUTOMATIC
          ? "transmission.automatic"
          : "transmission.manual",
      ),
    },
    { label: t("fuel"), value: tCars(`fuel.${vehicle.fuel}`) },
    { label: t("seats"), value: tCars("seats", { count: vehicle.seats }) },
  ];

  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-border bg-surface p-5",
        className,
      )}
    >
      {specs.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="text-sm font-medium text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
