import { NextRequest, NextResponse } from "next/server";
import {
  isTenantHostPublicPath,
  isTenantInternalPath,
  toTenantInternalPath,
} from "@/lib/tenantRouting";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const marketplaceDomain = process.env.NEXT_PUBLIC_MARKETPLACE_DOMAIN ?? "benwer.es";

  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const companySlug = resolveCompanySlug(host, marketplaceDomain, isLocalhost);
  const pathname = request.nextUrl.pathname;

  const requestHeaders = new Headers(request.headers);
  if (companySlug) {
    requestHeaders.set("x-company-slug", companySlug);
  }

  if (!companySlug && isTenantInternalPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (companySlug && isTenantHostPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = toTenantInternalPath(pathname);
    const response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    response.headers.set("x-company-slug", companySlug);
    return response;
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
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
