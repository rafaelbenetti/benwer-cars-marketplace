import type { Company } from "@/types/company";
import { apiClient } from "./client";

interface ApiCompany {
  id: string;
  slug: string;
  name: string;
  isPublic: boolean;
  branding: {
    primaryColor: string;
    logoUrl: string | null;
  };
  defaultLocale: string;
  currency: string;
}

function mapCompany(raw: ApiCompany): Company {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: null,
    location: null,
    isPublic: raw.isPublic,
    branding: {
      primaryColor: raw.branding.primaryColor,
      logoUrl: raw.branding.logoUrl,
    },
  };
}

export const companiesApi = {
  getAll(): Promise<Company[]> {
    return apiClient
      .get<ApiCompany[] | null>("/v1/public/companies")
      .then((rows) => (rows ?? []).map(mapCompany));
  },

  getBySlug(slug: string): Promise<Company> {
    return apiClient
      .get<ApiCompany>(`/v1/public/companies/${slug}`)
      .then(mapCompany);
  },
};
