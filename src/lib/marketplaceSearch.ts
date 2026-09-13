import { NavRoutes, SearchParams } from "@/enums";
import { DEFAULT_CITY_SLUG } from "@/data/malagaCities";

export function appendSearchParams(
  path: string,
  input?: {
    location?: string;
    from?: string;
    to?: string;
    view?: string;
    companySlug?: string;
  },
): string {
  const params = new URLSearchParams();

  if (input?.location) {
    params.set(SearchParams.LOCATION, input.location);
  }

  if (input?.from) {
    params.set(SearchParams.FROM, input.from);
  }

  if (input?.to) {
    params.set(SearchParams.TO, input.to);
  }

  if (input?.view) {
    params.set(SearchParams.VIEW, input.view);
  }

  if (input?.companySlug) {
    params.set(SearchParams.COMPANY_SLUG, input.companySlug);
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function buildCarsSearchHref(input: {
  location?: string;
  from?: string;
  to?: string;
  companySlug?: string;
}): string {
  return appendSearchParams(NavRoutes.CARS, {
    location: input.location || DEFAULT_CITY_SLUG,
    from: input.from,
    to: input.to,
    companySlug: input.companySlug,
  });
}

export function buildCompaniesSearchHref(input: {
  location?: string;
  from?: string;
  to?: string;
  view?: string;
}): string {
  return appendSearchParams(NavRoutes.COMPANIES, {
    location: input.location || DEFAULT_CITY_SLUG,
    from: input.from,
    to: input.to,
    view: input.view,
  });
}

export function buildCompaniesMapHref(input?: {
  from?: string;
  to?: string;
}): string {
  return appendSearchParams(NavRoutes.COMPANIES, {
    from: input?.from,
    to: input?.to,
    view: "map",
  });
}

export function buildCompanyHref(
  slug: string,
  input?: {
    location?: string;
    from?: string;
    to?: string;
  },
): string {
  return appendSearchParams(`${NavRoutes.COMPANIES}/${slug}`, input);
}
