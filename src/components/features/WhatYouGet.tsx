import { LayoutDashboard, Smartphone, Store } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function WhatYouGet() {
  const t = await getTranslations("whatYouGet");
  const features = [
    { icon: LayoutDashboard, title: t("admin.title"), body: t("admin.body") },
    { icon: Smartphone, title: t("mobile.title"), body: t("mobile.body") },
    { icon: Store, title: t("storefront.title"), body: t("storefront.body") },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex max-w-2xl flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {t("eyebrow")}
        </p>
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <li
              key={feature.title}
              className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4"
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
    </section>
  );
}
