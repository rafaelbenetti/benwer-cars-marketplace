import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const LOCALSTACK_ORIGIN = process.env.LOCALSTACK_ORIGIN ?? "http://localhost:4566";

function extraMediaRemotePattern(): {
  protocol: "http" | "https";
  hostname: string;
  pathname: string;
}[] {
  const raw = process.env.NEXT_PUBLIC_MEDIA_ORIGIN;
  if (!raw) {
    return [];
  }

  try {
    const url = new URL(raw);
    return [
      {
        protocol: url.protocol === "http:" ? "http" : "https",
        hostname: url.hostname,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.benwer.es",
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
      ...extraMediaRemotePattern(),
    ],
  },
  async rewrites() {
    return [
      {
        source: "/localstack/:path*",
        destination: `${LOCALSTACK_ORIGIN}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
