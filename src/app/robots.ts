import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://marketplace.benwer.es";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/book", "/booking/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
