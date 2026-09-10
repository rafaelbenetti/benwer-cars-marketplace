import type { MetadataRoute } from "next";
import { companiesApi, vehiclesApi } from "@/services/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://marketplace.benwer.es";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/companies`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const companies = await companiesApi.getAll();

    const companyRoutes: MetadataRoute.Sitemap = companies.map((company) => ({
      url: `${appUrl}/companies/${company.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    const vehicleRoutes: MetadataRoute.Sitemap = [];
    for (const company of companies) {
      try {
        const vehicles = await vehiclesApi.getByCompany(company.slug);
        for (const vehicle of vehicles) {
          vehicleRoutes.push({
            url: `${appUrl}/companies/${company.slug}/cars/${vehicle.id}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.7,
          });
        }
      } catch {
        /* skip if company vehicles unavailable */
      }
    }

    return [...staticRoutes, ...companyRoutes, ...vehicleRoutes];
  } catch {
    return staticRoutes;
  }
}
