import Link from "next/link";
import { CalendarRange } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BookingVehiclePreview } from "./BookingVehiclePreview";
import { countRentalDays, formatLongDate, parseIsoDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";
import type { Vehicle } from "@/types/vehicle";

interface BookingSummaryProps {
  vehicle: Vehicle;
  company?: Company | null;
  from?: string;
  to?: string;
  carHref: string;
  className?: string;
}

export function BookingSummary({
  vehicle,
  company,
  from,
  to,
  carHref,
  className,
}: BookingSummaryProps) {
  const t = useTranslations("booking");
  const tCars = useTranslations("cars");
  const locale = useLocale();
  const days = countRentalDays(from ?? "", to ?? "");
  const hasDates = days > 0;
  const fromDate = from ? parseIsoDate(from) : null;
  const toDate = to ? parseIsoDate(to) : null;
  const rate = formatMoney(vehicle.pricePerDay, vehicle.currency, locale);
  const total = hasDates
    ? formatMoney(days * vehicle.pricePerDay, vehicle.currency, locale)
    : null;

  return (
    <aside
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-md",
        className,
      )}
    >
      <h2 className="text-base font-semibold text-foreground">{t("summary")}</h2>

      <BookingVehiclePreview vehicle={vehicle} companyName={company?.name} />

      {!hasDates ? (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-surface-muted/60 px-4 py-5">
          <CalendarRange size={20} className="text-muted-foreground" aria-hidden />
          <div>
            <p className="text-sm font-medium text-foreground">{t("datesMissingTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("datesMissingDescription")}
            </p>
          </div>
          <Link
            href={carHref}
            className="w-fit cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("pickDates")}
          </Link>
        </div>
      ) : (
        <dl className="flex flex-col gap-3">
          {company ? (
            <SummaryRow label={t("company")} value={company.name} />
          ) : null}
          <SummaryRow
            label={t("startDate")}
            value={fromDate ? formatLongDate(fromDate, locale) : from ?? ""}
          />
          <SummaryRow
            label={t("endDate")}
            value={toDate ? formatLongDate(toDate, locale) : to ?? ""}
          />
          <SummaryRow label={t("duration")} value={t("nights", { count: days })} />
          <SummaryRow
            label={t("rate")}
            value={tCars("perDay", { price: rate })}
          />
        </dl>
      )}

      {total ? (
        <div className="flex flex-col gap-1 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground">{t("totalPrice")}</span>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {total}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("rateTimesDays", {
              rate,
              days: t("nights", { count: days }),
            })}
          </p>
        </div>
      ) : null}
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
