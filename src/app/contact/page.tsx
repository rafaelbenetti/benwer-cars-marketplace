import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/features/ContactForm";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { NavRoutes } from "@/enums";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("contact");
  const tBrand = await getTranslations("brand");

  return buildPageMetadata({
    title: t("title"),
    description: t("lede"),
    path: "/contact",
    siteName: tBrand("name"),
    locale,
  });
}

async function ContactPage() {
  const t = await getTranslations("contact");
  const tNav = await getTranslations("nav");

  return (
    <LegalLayout width="form">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">{t("lede")}</p>
          <p className="text-sm text-muted-foreground">{t("bookingHint")}</p>
        </header>
        <ContactForm />
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-label={tNav("footerAria")}>
          <Link
            href={NavRoutes.PRIVACY}
            className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {tNav("privacy")}
          </Link>
          <Link
            href={NavRoutes.TERMS}
            className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {tNav("terms")}
          </Link>
          <Link
            href={NavRoutes.COOKIES}
            className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {tNav("cookies")}
          </Link>
        </nav>
      </div>
    </LegalLayout>
  );
}

export default ContactPage;
