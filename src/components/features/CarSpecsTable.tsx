import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";
import { FuelType, TransmissionType } from "@/enums";

interface CarSpecsTableProps {
  vehicle: Vehicle;
  className?: string;
}

export function CarSpecsTable({ vehicle, className }: CarSpecsTableProps) {
  const specs: { label: string; value: string }[] = [
    { label: "Year", value: String(vehicle.year) },
    { label: "Type", value: formatType(vehicle.type) },
    { label: "Transmission", value: formatTransmission(vehicle.transmission) },
    { label: "Fuel", value: formatFuel(vehicle.fuel) },
    { label: "Seats", value: `${vehicle.seats} seats` },
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

function formatType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatTransmission(t: TransmissionType): string {
  return t === TransmissionType.AUTOMATIC ? "Automatic" : "Manual";
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
