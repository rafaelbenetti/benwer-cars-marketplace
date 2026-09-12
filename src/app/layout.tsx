import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { QueryProvider } from "@/context/QueryProvider";
import { StorageKeys } from "@/enums";
import { routing } from "@/i18n/routing";
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

export const metadata: Metadata = {
  title: {
    default: "Benwer Cars — Find and Book Local Car Rentals",
    template: "%s — Benwer Cars",
  },
  description: "Browse and book cars from local rental companies near you.",
};

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
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
