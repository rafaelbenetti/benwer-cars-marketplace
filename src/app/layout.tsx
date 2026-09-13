import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Toaster } from "sonner";
import { QueryProvider } from "@/context/QueryProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { CookieBanner } from "@/components/features/CookieBanner";
import { StorageKeys } from "@/enums";
import { routing } from "@/i18n/routing";
import { buildPageMetadata, getSiteUrl, websiteJsonLd } from "@/lib/seo";
import enCommon from "../../messages/en-GB/common.json";
import enMarketplace from "../../messages/en-GB/marketplace.json";
import esCommon from "../../messages/es-ES/common.json";
import esMarketplace from "../../messages/es-ES/marketplace.json";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const tMeta = await getTranslations("meta");
  const tBrand = await getTranslations("brand");
  const page = buildPageMetadata({
    title: tMeta("siteTitle"),
    description: tMeta("siteDescription"),
    path: "/",
    siteName: tBrand("name"),
    locale,
  });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${tBrand("name")} — ${tMeta("siteTitle")}`,
      template: `%s — ${tBrand("name")}`,
    },
    description: tMeta("siteDescription"),
    alternates: page.alternates,
    openGraph: {
      ...page.openGraph,
      title: `${tBrand("name")} — ${tMeta("siteTitle")}`,
    },
    twitter: {
      ...page.twitter,
      title: `${tBrand("name")} — ${tMeta("siteTitle")}`,
    },
  };
}

function resolveLocale(value: string | undefined): "en-GB" | "es-ES" {
  return value === "es-ES" ? "es-ES" : routing.defaultLocale;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(StorageKeys.LOCALE)?.value);
  const messages =
    locale === "es-ES"
      ? { ...esCommon, ...esMarketplace }
      : { ...enCommon, ...enMarketplace };

  return (
    <html lang={locale} className={inter.variable}>
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <JsonLd
              data={websiteJsonLd({
                name: messages.brand.name,
                description: messages.meta.siteDescription,
              })}
            />
            {children}
            <CookieBanner />
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
