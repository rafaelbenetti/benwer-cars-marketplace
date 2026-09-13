import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/Button";
import { env } from "@/env";
import { cn } from "@/lib/utils";

export async function PartnersInvite() {
  const t = await getTranslations("partners");
  const plansHref = env.NEXT_PUBLIC_MARKETING_URL;
  const demoHref = env.NEXT_PUBLIC_ADMIN_DEMO_URL;

  return (
    <section className="rounded-3xl bg-foreground px-6 py-10 text-background sm:px-10 sm:py-12 lg:px-14 lg:py-14">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-background/70">
        {t("eyebrow")}
      </p>
      <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background/75 md:text-base">
        {t("description")}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={plansHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("ctaAria")}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
        >
          {t("cta")}
          <ArrowUpRight size={16} aria-hidden />
        </a>
        {demoHref ? (
          <a
            href={demoHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("demoAria")}
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "w-full border-background/20 bg-transparent text-background hover:bg-background/10 sm:w-auto",
            )}
          >
            {t("demo")}
          </a>
        ) : null}
      </div>
      <p className="mt-6 text-xs text-background/55">{t("footnote")}</p>
    </section>
  );
}
