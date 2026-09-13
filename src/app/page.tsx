import { headers } from "next/headers";
import type { Metadata } from "next";
import { MarketplaceHome, generateMarketplaceHomeMetadata } from "./(marketplace)/MarketplaceHome";
import { TenantHome, generateTenantMetadata } from "./(tenant)/TenantHome";

export async function generateMetadata(): Promise<Metadata> {
  const slug = (await headers()).get("x-company-slug");
  if (slug) {
    return generateTenantMetadata();
  }

  return generateMarketplaceHomeMetadata();
}

async function HomePage() {
  const slug = (await headers()).get("x-company-slug");
  if (slug) {
    return <TenantHome />;
  }

  return <MarketplaceHome />;
}

export default HomePage;
