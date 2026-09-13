import { Building2, CalendarDays, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  const steps = [
    { icon: Search, title: t("searchTitle"), body: t("searchBody") },
    { icon: Building2, title: t("compareTitle"), body: t("compareBody") },
    { icon: CalendarDays, title: t("bookTitle"), body: t("bookBody") },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="flex gap-4 rounded-xl border border-border bg-surface p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-subtle-foreground">
                  {index + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
