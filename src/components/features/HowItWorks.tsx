import { Building2, CalendarSearch, CarFront, Handshake } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  const steps = [
    { icon: CalendarSearch, title: t("searchTitle"), body: t("searchBody") },
    { icon: CarFront, title: t("compareTitle"), body: t("compareBody") },
    { icon: Handshake, title: t("continueTitle"), body: t("continueBody") },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex max-w-2xl flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={18} aria-hidden />
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("stepLabel", { number: index + 1 })}
                </p>
              </div>
              <p className="text-base font-semibold text-foreground">{step.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          );
        })}
      </ol>
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Building2 size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden />
        <span className="flex flex-col gap-1">
          <span className="font-medium text-foreground">{t("companiesTitle")}</span>
          <span>{t("companiesBody")}</span>
        </span>
      </p>
    </section>
  );
}
