import { NavRoutes, SearchParams } from "@/enums";

export function buildBookHref(input: {
  companySlug: string;
  carId: string;
  from: string;
  to: string;
}): string {
  const params = new URLSearchParams();
  params.set(SearchParams.COMPANY_SLUG, input.companySlug);
  params.set(SearchParams.CAR_ID, input.carId);
  params.set(SearchParams.FROM, input.from);
  params.set(SearchParams.TO, input.to);
  return `${NavRoutes.BOOK}?${params.toString()}`;
}
