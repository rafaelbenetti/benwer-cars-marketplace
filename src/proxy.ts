import { NextRequest, NextResponse } from "next/server";

// Reads the host header and injects x-company-slug for tenant subdomain
// requests. The marketplace app uses this header to render either the
// tenant-branded view or the global marketplace view.
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const marketplaceDomain =
    process.env.NEXT_PUBLIC_MARKETPLACE_DOMAIN ?? "benwer.es";
  const isLocalhost =
    host.includes("localhost") || host.includes("127.0.0.1");

  const companySlug = resolveCompanySlug(host, marketplaceDomain, isLocalhost);

  const response = NextResponse.next();
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

  const subdomainMatch = host.match(
    new RegExp(`^([^.]+)\\.${domain.replace(".", "\\.")}$`),
  );
  if (subdomainMatch?.[1]) {
    return subdomainMatch[1];
  }

  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)",
  ],
};
