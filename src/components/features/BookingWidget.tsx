"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";


interface BookingWidgetProps {
  vehicle: Vehicle;
  companySlug: string;
  className?: string;
}

export function BookingWidget({
  vehicle,
  companySlug,
  className,
}: BookingWidgetProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const days = from && to ? computeDays(from, to) : null;
  const total = days && days > 0 ? days * vehicle.pricePerDay : null;

  const bookHref =
    from && to && days && days > 0
      ? `/book?companySlug=${companySlug}&carId=${vehicle.id}&from=${from}&to=${to}`
      : null;

  const priceFormatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: vehicle.currency,
    minimumFractionDigits: 0,
  }).format(vehicle.pricePerDay);

  const totalFormatted = total
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: vehicle.currency,
        minimumFractionDigits: 0,
      }).format(total)
    : null;

  return (
    <div
      className={cn(
        "sticky top-20 rounded-xl border border-border bg-surface p-5 flex flex-col gap-5",
        className,
      )}
    >
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {priceFormatted}
        </span>
        <span className="text-sm text-muted-foreground">/ day</span>
      </div>

      <div className="flex flex-col gap-3">
        <Field label="Pick-up date" htmlFor="from" required>
          <Input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            min={todayString()}
          />
        </Field>
        <Field label="Drop-off date" htmlFor="to" required>
          <Input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            min={from || todayString()}
          />
        </Field>
      </div>

      {totalFormatted && days ? (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            {priceFormatted} × {days} day{days !== 1 ? "s" : ""}
          </span>
          <span className="text-base font-semibold tabular-nums text-foreground">
            {totalFormatted}
          </span>
        </div>
      ) : null}

      {bookHref ? (
        <Link
          href={bookHref}
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Book now
        </Link>
      ) : (
        <Button disabled className="w-full">
          {!from || !to ? "Select dates to continue" : "Invalid dates"}
        </Button>
      )}
    </div>
  );
}

function todayString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

function computeDays(from: string, to: string): number {
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}
