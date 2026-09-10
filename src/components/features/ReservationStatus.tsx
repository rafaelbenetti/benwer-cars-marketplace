"use client";

import { useReservation } from "@/hooks/useReservation";
import { StatusBadge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

interface ReservationStatusProps {
  token: string;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Pending",
  confirmed: "Confirmed",
  active: "Active — enjoy your trip!",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function ReservationStatus({ token }: ReservationStatusProps) {
  const { data, isPending, isError, refetch } = useReservation(token);

  if (isPending) return <ReservationStatusSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="Could not load your reservation. Check the link in your confirmation email."
        onRetry={refetch}
      />
    );

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: data.currency,
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Reference</p>
          <p className="font-mono text-sm font-medium text-foreground mt-0.5">
            {data.token.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <StatusBadge
          status={data.status}
          label={STATUS_LABELS[data.status] ?? data.status}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Pick-up</p>
          <p className="text-sm font-medium text-foreground mt-0.5">
            {fmtDate(data.startDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Drop-off</p>
          <p className="text-sm font-medium text-foreground mt-0.5">
            {fmtDate(data.endDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Guest</p>
          <p className="text-sm font-medium text-foreground mt-0.5">
            {data.guestName}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-sm font-semibold tabular-nums text-foreground mt-0.5">
            {fmt(data.totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}

function ReservationStatusSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
