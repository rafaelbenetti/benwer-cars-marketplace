"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("booking");
  const tCars = useTranslations("cars");
  const tDetail = useTranslations("carDetail");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const days = from && to ? computeDays(from, to) : null;
  const total = days && days > 0 ? days * vehicle.pricePerDay : null;

  const bookHref =
    from && to && days && days > 0
      ? `/book?companySlug=${companySlug}&carId=${vehicle.id}&from=${from}&to=${to}`
      : null;

  const priceFormatted = formatPrice(vehicle.pricePerDay, vehicle.currency);
  const totalFormatted = total ? formatPrice(total, vehicle.currency) : null;

  return (
    <div
      className={cn(
        "sticky top-20 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-md",
        className,
      )}
    >
      <p className="text-2xl font-semibold tabular-nums text-foreground">
        {tCars("perDay", { price: priceFormatted })}
      </p>

      <div className="flex flex-col gap-3">
        <Field label={t("startDate")} htmlFor="from" required>
          <Input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            min={todayString()}
            className="h-11"
          />
        </Field>
        <Field label={t("endDate")} htmlFor="to" required>
          <Input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            min={from || todayString()}
            className="h-11"
          />
        </Field>
      </div>

      {totalFormatted && days ? (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            {priceFormatted} × {t("nights", { count: days })}
          </span>
          <span className="text-base font-semibold tabular-nums text-foreground">
            {totalFormatted}
          </span>
        </div>
      ) : null}

      {bookHref ? (
        <Link
          href={bookHref}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {tDetail("bookNow")}
        </Link>
      ) : (
        <Button disabled className="h-11 w-full">
          {!from || !to ? t("selectDates") : t("invalidDates")}
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

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
