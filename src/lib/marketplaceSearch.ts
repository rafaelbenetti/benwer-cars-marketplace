import { NavRoutes, SearchParams } from "@/enums";
import { DEFAULT_CITY_SLUG } from "@/data/malagaCities";

export function appendSearchParams(
  path: string,
  input?: {
    location?: string;
    from?: string;
    to?: string;
    view?: string;
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

  const query = params.toString();
  return query ? `${path}?${query}` : path;
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
