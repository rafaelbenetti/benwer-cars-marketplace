import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  const steps = [
    { title: t("searchTitle"), body: t("searchBody") },
    { title: t("compareTitle"), body: t("compareBody") },
    { title: t("continueTitle"), body: t("continueBody") },
  ];

  return (
    <section className="flex flex-col gap-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        <div
          aria-hidden
          className="pointer-events-none absolute top-5 right-[16.666%] left-[16.666%] hidden h-px bg-border md:block"
        />
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex flex-col items-center text-center">
            <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-medium text-primary">
              {index + 1}
            </span>
            <p className="mt-4 text-base font-semibold text-foreground">{step.title}</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
