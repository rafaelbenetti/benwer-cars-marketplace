import { NextRequest, NextResponse } from "next/server";
import createNextIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createNextIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const marketplaceDomain = process.env.NEXT_PUBLIC_MARKETPLACE_DOMAIN ?? "benwer.es";

  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const companySlug = resolveCompanySlug(host, marketplaceDomain, isLocalhost);

  const response = intlMiddleware(request);

  if (companySlug) {
    response.headers.set("x-company-slug", companySlug);
  }

  return response;
}

function resolveCompanySlug(
  host: string,
  domain: string,
  isLocalhost: boolean,
): string | null {
  if (isLocalhost) {
    return null;
  }

  const marketplaceHosts = [`marketplace.${domain}`, `www.${domain}`, domain];
  if (marketplaceHosts.some((h) => host === h)) {
    return null;
  }

  const subdomainMatch = host.match(new RegExp(`^([^.]+)\\.${domain.replace(".", "\\.")}$`));
  if (subdomainMatch?.[1]) {
    return subdomainMatch[1];
  }

  return null;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
