import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { LegalArticle } from "@/components/layout/LegalArticle";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { readLegalSections } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("legal.privacy");
  const tBrand = await getTranslations("brand");

  return buildPageMetadata({
    title: t("title"),
    description: t("lede"),
    path: "/privacy",
    siteName: tBrand("name"),
    locale,
  });
}

async function PrivacyPage() {
  const t = await getTranslations("legal.privacy");

  return (
    <LegalLayout>
      <LegalArticle
        title={t("title")}
        lede={t("lede")}
        updated={t("updated")}
        sections={readLegalSections(t.raw("sections"))}
      />
    </LegalLayout>
  );
}

export default PrivacyPage;
