import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/Button";
import { env } from "@/env";
import { cn } from "@/lib/utils";

const DEFAULT_PLANS_URL = "https://cars.benwer.es";

export async function PartnersInvite() {
  const t = await getTranslations("partners");
  const plansHref = env.NEXT_PUBLIC_MARKETING_URL || DEFAULT_PLANS_URL;
  const demoHref = env.NEXT_PUBLIC_ADMIN_DEMO_URL;

  return (
    <section
      id="partners"
      className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-surface via-primary/10 to-accent-soft px-6 py-10 text-foreground sm:px-10 sm:py-12 lg:px-14 lg:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
      />
      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
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
                "w-full sm:w-auto",
              )}
            >
              {t("demo")}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
