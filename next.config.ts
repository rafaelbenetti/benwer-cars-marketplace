import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:8080";
const LOCALSTACK_ORIGIN = process.env.LOCALSTACK_ORIGIN ?? "http://localhost:4566";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4566",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4566",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/:path*`,
      },
      {
        source: "/localstack/:path*",
        destination: `${LOCALSTACK_ORIGIN}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
