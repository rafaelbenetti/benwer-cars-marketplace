import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

const FAQ_ITEMS = ["booking", "account", "photos", "companies", "safety"] as const;

export async function MarketplaceFaq() {
  const t = await getTranslations("faq");

  return (
    <section className="flex flex-col gap-6">
      <div className="flex max-w-2xl flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="divide-y divide-border rounded-xl border border-border bg-surface">
        {FAQ_ITEMS.map((item) => (
          <details key={item} className="group px-4 py-3 md:px-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
              {t(`items.${item}.question`)}
              <ChevronDown
                size={16}
                aria-hidden
                className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="mt-2 max-w-3xl pb-2 text-sm leading-relaxed text-muted-foreground">
              {t(`items.${item}.answer`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
