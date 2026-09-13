export const TENANT_INTERNAL_PREFIX = "/tenant";

export function isTenantInternalPath(pathname: string): boolean {
  return (
    pathname === TENANT_INTERNAL_PREFIX ||
    pathname.startsWith(`${TENANT_INTERNAL_PREFIX}/`)
  );
}

export function isTenantHostPublicPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/cars" || pathname.startsWith("/cars/");
}

export function toTenantInternalPath(pathname: string): string {
  if (pathname === "/") {
    return TENANT_INTERNAL_PREFIX;
  }
  return `${TENANT_INTERNAL_PREFIX}${pathname}`;
}
