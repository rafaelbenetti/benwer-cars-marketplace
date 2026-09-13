"use client";

import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { BookingFormValues } from "@/lib/bookingSchema";
import { addCalendarDays, startOfToday, toIsoDate } from "@/lib/dates";

interface BookingFormProps {
  carHref: string;
}

export function BookingForm({ carHref }: BookingFormProps) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const startDate = useWatch({ control, name: "startDate" }) ?? "";
  const minStart = toIsoDate(startOfToday());
  const minEnd = addCalendarDays(startDate, 1) ?? minStart;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{t("details")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("detailsHint")}</p>
      </div>

      <Field
        label={t("guestName")}
        htmlFor="guestName"
        error={errors.guestName?.message}
        required
      >
        <Input
          id="guestName"
          type="text"
          autoComplete="name"
          placeholder={t("guestNamePlaceholder")}
          className="h-11"
          {...register("guestName")}
        />
      </Field>

      <Field
        label={t("guestEmail")}
        htmlFor="guestEmail"
        hint={t("guestEmailHint")}
        error={errors.guestEmail?.message}
        required
      >
        <Input
          id="guestEmail"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          placeholder={t("guestEmailPlaceholder")}
          className="h-11"
          {...register("guestEmail")}
        />
      </Field>

      <Field
        label={t("guestPhone")}
        htmlFor="guestPhone"
        hint={t("guestPhoneHint")}
        error={errors.guestPhone?.message}
        required
      >
        <Input
          id="guestPhone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder={t("guestPhonePlaceholder")}
          className="h-11"
          {...register("guestPhone")}
        />
      </Field>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{t("datesHint")}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label={t("startDate")}
            htmlFor="startDate"
            error={errors.startDate?.message}
            required
          >
            <Input
              id="startDate"
              type="date"
              lang={locale}
              min={minStart}
              className="h-11"
              {...register("startDate")}
            />
          </Field>
          <Field
            label={t("endDate")}
            htmlFor="endDate"
            error={errors.endDate?.message}
            required
          >
            <Input
              id="endDate"
              type="date"
              lang={locale}
              min={minEnd}
              className="h-11"
              {...register("endDate")}
            />
          </Field>
        </div>
        <Link
          href={carHref}
          className="w-fit cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t("changeDates")}
        </Link>
      </div>
    </div>
  );
}
