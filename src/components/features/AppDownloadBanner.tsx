import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { QrCodePlaceholder } from "@/components/layout/QrCodePlaceholder";
import { StoreBadges } from "@/components/layout/StoreBadges";

export async function AppDownloadBanner() {
  const t = await getTranslations("appBanner");

  return (
    <section
      aria-labelledby="app-download-heading"
      className="rounded-2xl border border-border bg-surface px-4 py-6 text-foreground sm:px-8 sm:py-7"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {t("eyebrow")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2
              id="app-download-heading"
              className="text-2xl font-medium tracking-tight sm:text-3xl"
            >
              {t("title")}
            </h2>
            <Badge variant="info">{t("comingSoon")}</Badge>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("description")}
          </p>
          <StoreBadges
            className="mt-5"
            appStore={{
              prefix: t("appStore.prefix"),
              name: t("appStore.name"),
              aria: t("appStore.aria"),
            }}
            googlePlay={{
              prefix: t("googlePlay.prefix"),
              name: t("googlePlay.name"),
              aria: t("googlePlay.aria"),
            }}
          />
        </div>
        <figure className="flex shrink-0 flex-col items-center gap-2 self-center">
          <div className="rounded-xl border border-border bg-surface p-3">
            <QrCodePlaceholder className="h-32 w-32 sm:h-36 sm:w-36" />
          </div>
          <figcaption className="text-xs font-medium text-muted-foreground">
            {t("scanToDownload")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
