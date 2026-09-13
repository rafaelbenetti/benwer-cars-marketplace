import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MarketplaceHeader } from "@/components/layout/MarketplaceHeader";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/EmptyState";
import { NavRoutes } from "@/enums";

async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-16 md:px-6 lg:px-8">
        <EmptyState
          icon={<MapPin size={40} />}
          title={t("title")}
          description={t("description")}
          actionLabel={t("action")}
          actionHref={NavRoutes.HOME}
        />
      </main>
      <Footer />
    </>
  );
}

export default NotFoundPage;
