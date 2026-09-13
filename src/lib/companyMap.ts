import { getMappableCity, type MappableMalagaCity } from "@/data/malagaCities";
import type { Company } from "@/types/company";

export interface CompanyMapPin {
  id: string;
  slug: string;
  name: string;
  city: MappableMalagaCity;
  lat: number;
  lng: number;
  vehicleCount: number | null;
  href: string;
}

const PIN_OFFSET_DEGREES = 0.012;

function offsetForIndex(index: number, total: number): { lat: number; lng: number } {
  if (total <= 1) {
    return { lat: 0, lng: 0 };
  }

  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    lat: Math.sin(angle) * PIN_OFFSET_DEGREES,
    lng: Math.cos(angle) * PIN_OFFSET_DEGREES,
  };
}

export function toCompanyMapPins(
  companies: Company[],
  hrefFor: (company: Company) => string,
): CompanyMapPin[] {
  const grouped = new Map<string, Company[]>();

  for (const company of companies) {
    if (!company.locationSlug || !getMappableCity(company.locationSlug)) {
      continue;
    }

    const existing = grouped.get(company.locationSlug) ?? [];
    existing.push(company);
    grouped.set(company.locationSlug, existing);
  }

  const pins: CompanyMapPin[] = [];

  for (const [locationSlug, group] of grouped) {
    const city = getMappableCity(locationSlug);
    if (!city) {
      continue;
    }

    group.forEach((company, index) => {
      const offset = offsetForIndex(index, group.length);
      pins.push({
        id: company.id,
        slug: company.slug,
        name: company.name,
        city,
        lat: city.lat + offset.lat,
        lng: city.lng + offset.lng,
        vehicleCount: company.vehicleCount,
        href: hrefFor(company),
      });
    });
  }

  return pins;
}
