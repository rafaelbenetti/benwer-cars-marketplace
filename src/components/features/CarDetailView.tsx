"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AvailabilityCalendarSkeleton } from "./AvailabilityCalendarSkeleton";
import { BookingWidget } from "./BookingWidget";
import { CarPhotoGallery } from "./CarPhotoGallery";
import { CarSpecsTable } from "./CarSpecsTable";
import { useAvailability } from "@/hooks/useAvailability";
import {
  availabilityCalendarWindow,
  rangeIncludesUnavailable,
  sanitizeDateRange,
  unavailableDatesForVehicle,
} from "@/lib/availability";
import type { Vehicle } from "@/types/vehicle";

const AvailabilityCalendar = dynamic(
  () =>
    import("./AvailabilityCalendar").then((mod) => mod.AvailabilityCalendar),
  {
    loading: () => (
      <section className="rounded-2xl border border-border bg-surface p-5">
        <AvailabilityCalendarSkeleton />
      </section>
    ),
  },
);

interface CarDetailViewProps {
  vehicle: Vehicle;
  companySlug: string;
  initialFrom?: string;
  initialTo?: string;
  backHref?: string;
  backLabel?: string;
}

export function CarDetailView({
  vehicle,
  companySlug,
  initialFrom,
  initialTo,
  backHref,
  backLabel,
}: CarDetailViewProps) {
  const t = useTranslations("carDetail");
  const calendarWindow = availabilityCalendarWindow();
  const { data, isPending, isError, refetch } = useAvailability(companySlug, {
    from: calendarWindow.from,
    to: calendarWindow.to,
    vehicleId: vehicle.id,
  });
  const unavailableDates = useMemo(
    () => unavailableDatesForVehicle(data, vehicle.id),
    [data, vehicle.id],
  );
  const [range, setRange] = useState(() =>
    sanitizeDateRange(initialFrom, initialTo),
  );
  const displayRange =
    !isPending &&
    !isError &&
    range.from &&
    range.to &&
    rangeIncludesUnavailable(range.from, range.to, unavailableDates)
      ? { from: "", to: "" }
      : range;
  const isRangeBlocked =
    Boolean(displayRange.from) &&
    Boolean(displayRange.to) &&
    rangeIncludesUnavailable(
      displayRange.from,
      displayRange.to,
      unavailableDates,
    );

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
        {backHref && backLabel ? (
          <Link
            href={backHref}
            className="w-fit cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {backLabel}
          </Link>
        ) : null}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{vehicle.year}</p>
        </div>
        <CarPhotoGallery
          photos={vehicle.photos}
          alt={`${vehicle.brand} ${vehicle.model}`}
        />
        {vehicle.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {vehicle.description}
          </p>
        ) : null}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            {t("specs")}
          </h2>
          <CarSpecsTable vehicle={vehicle} />
        </div>
        <AvailabilityCalendar
          from={displayRange.from}
          to={displayRange.to}
          onChange={setRange}
          unavailableDates={unavailableDates}
          isPending={isPending}
          isError={isError}
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
      <div className="pb-24 lg:pb-0">
        <BookingWidget
          vehicle={vehicle}
          companySlug={companySlug}
          from={displayRange.from}
          to={displayRange.to}
          isRangeBlocked={isRangeBlocked}
          isAvailabilityPending={isPending}
          isAvailabilityError={isError}
        />
      </div>
    </div>
  );
}
