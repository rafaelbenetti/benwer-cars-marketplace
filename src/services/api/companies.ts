import type { Company, CompanyBranding } from "@/types/company";
import { mockClient } from "./client";

export const companiesApi = {
  getAll(): Promise<Company[]> {
    return mockClient.get<Company[]>("/mock-data/companies.json");
  },

  getBySlug(slug: string): Promise<Company & { branding: CompanyBranding }> {
    return mockClient.get<Company & { branding: CompanyBranding }>(
      `/mock-data/companies/${slug}.json`,
    );
  },
};
