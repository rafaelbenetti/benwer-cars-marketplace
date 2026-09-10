import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";

interface BookingSummaryProps {
  vehicle: Vehicle;
  from?: string;
  to?: string;
  className?: string;
}

export function BookingSummary({
  vehicle,
  from,
  to,
  className,
}: BookingSummaryProps) {
  const days = from && to ? computeDays(from, to) : null;
  const total = days && days > 0 ? days * vehicle.pricePerDay : null;

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: vehicle.currency,
      minimumFractionDigits: 0,
    }).format(amount);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5 flex flex-col gap-4",
        className,
      )}
    >
      <h2 className="text-base font-semibold text-foreground">
        Booking summary
      </h2>

      <div className="flex flex-col gap-2">
        <SummaryRow
          label="Vehicle"
          value={`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
        />
        {from ? (
          <SummaryRow label="Pick-up" value={fmtDate(from)} />
        ) : null}
        {to ? (
          <SummaryRow label="Drop-off" value={fmtDate(to)} />
        ) : null}
        {days && days > 0 ? (
          <SummaryRow
            label="Duration"
            value={`${days} day${days !== 1 ? "s" : ""}`}
          />
        ) : null}
        <SummaryRow label="Rate" value={`${fmt(vehicle.pricePerDay)} / day`} />
      </div>

      {total ? (
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Total</span>
          <span className="text-lg font-semibold tabular-nums text-foreground">
            {fmt(total)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs text-foreground text-right">{value}</span>
    </div>
  );
}

function computeDays(from: string, to: string): number {
  return Math.max(
    0,
    Math.ceil(
      (new Date(to).getTime() - new Date(from).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
}
