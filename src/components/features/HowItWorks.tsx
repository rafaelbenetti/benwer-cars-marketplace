import { ArrowUpRight, Building2, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  const steps = [
    { icon: Search, title: t("searchTitle"), body: t("searchBody") },
    { icon: Building2, title: t("compareTitle"), body: t("compareBody") },
    { icon: ArrowUpRight, title: t("continueTitle"), body: t("continueBody") },
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
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.title}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-primary/15 bg-surface p-5 shadow-sm",
                isLast && "bg-gradient-to-br from-surface via-surface to-primary/10",
              )}
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1 bg-primary"
              />
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-base font-semibold text-foreground">
                    {step.title}
                    <Icon size={16} className="text-primary" aria-hidden />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
