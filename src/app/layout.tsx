import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers, cookies } from "next/headers";
import { Toaster } from "sonner";
import { QueryProvider } from "@/context/QueryProvider";
import { companiesApi } from "@/services/api";
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

const supportedLocales = ["en-GB", "es-ES"] as const;
type Locale = (typeof supportedLocales)[number];

async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && supportedLocales.includes(raw as Locale)) return raw as Locale;
  return "en-GB";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headersList, locale] = await Promise.all([headers(), resolveLocale()]);

  const companySlug = headersList.get("x-company-slug");

  let brandColor: string | null = null;
  if (companySlug) {
    try {
      const company = await companiesApi.getBySlug(companySlug);
      brandColor = company.branding.primaryColor;
    } catch {
      /* keep default */
    }
  }

  const brandStyle = brandColor
    ? ({ "--primary": brandColor } as CSSProperties)
    : undefined;

  return (
    <html lang={locale} className={inter.variable}>
      <body
        className="bg-background text-foreground antialiased"
        style={brandStyle}
      >
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
