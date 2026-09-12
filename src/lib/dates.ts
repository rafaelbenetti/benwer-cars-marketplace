import { format, isValid, parseISO, startOfDay } from "date-fns";
import { enGB, es } from "date-fns/locale";

const DATE_LOCALES = {
  "en-GB": enGB,
  "es-ES": es,
} as const;

export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = parseISO(value);
  if (!isValid(parsed)) {
    return null;
  }

  return startOfDay(parsed);
}

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatSearchDate(date: Date, locale: string): string {
  const dateLocale = locale === "es-ES" ? DATE_LOCALES["es-ES"] : DATE_LOCALES["en-GB"];
  return format(date, "d MMM", { locale: dateLocale });
}

export function startOfToday(): Date {
  return startOfDay(new Date());
}
