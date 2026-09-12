import { NavRoutes, SearchParams } from "@/enums";
import { DEFAULT_CITY_SLUG } from "@/data/malagaCities";

export function buildCompaniesSearchHref(input: {
  location: string;
  from?: string;
  to?: string;
}): string {
  const params = new URLSearchParams();
  params.set(SearchParams.LOCATION, input.location || DEFAULT_CITY_SLUG);

  if (input.from) {
    params.set(SearchParams.FROM, input.from);
  }

  if (input.to) {
    params.set(SearchParams.TO, input.to);
  }

  return `${NavRoutes.COMPANIES}?${params.toString()}`;
}
