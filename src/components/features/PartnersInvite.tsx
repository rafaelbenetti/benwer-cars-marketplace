import { ArrowUpRight, LayoutDashboard, Smartphone, Store } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/Button";
import { env } from "@/env";
import { cn } from "@/lib/utils";

const DEFAULT_PLANS_URL = "https://cars.benwer.es";

export async function PartnersInvite() {
  const t = await getTranslations("partners");
  const plansHref = env.NEXT_PUBLIC_MARKETING_URL || DEFAULT_PLANS_URL;
  const demoHref = env.NEXT_PUBLIC_ADMIN_DEMO_URL;
  const features = [
    { icon: LayoutDashboard, title: t("features.admin.title"), body: t("features.admin.body") },
    { icon: Smartphone, title: t("features.mobile.title"), body: t("features.mobile.body") },
    { icon: Store, title: t("features.storefront.title"), body: t("features.storefront.body") },
  ];

  return (
    <section
      id="partners"
      className="rounded-2xl border border-border bg-surface px-4 py-6 text-foreground sm:px-8 sm:py-8 lg:px-10"
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
        {t("eyebrow")}
      </p>
      <h2 className="mt-2 max-w-2xl text-2xl font-medium tracking-tight sm:text-3xl">
        {t("title")}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {t("description")}
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <li
              key={feature.title}
              className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} aria-hidden />
              </span>
              <p className="text-sm font-semibold text-foreground">{feature.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
    </section>
  );
}
