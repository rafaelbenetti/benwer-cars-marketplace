import type { NextConfig } from "next";

// next-intl is used without the createNextIntlPlugin wrapper so we can keep
// clean URLs (no /en-GB/ prefix). Locale is resolved server-side via
// getRequestConfig in src/i18n/request.ts and passed to layouts via
// NextIntlClientProvider. See docs/engineering.md §i18n.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
