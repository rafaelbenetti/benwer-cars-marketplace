import type { Company, CompanyBranding } from "@/types/company";
import { mockClient } from "./client";

export const companiesApi = {
  getAll(): Promise<Company[]> {
    return mockClient.get<Company[]>("/mock-data/companies.json");
  },

  getBySlug(slug: string): Promise<Company & { branding: CompanyBranding }> {
    return mockClient.get<Company[]>("/mock-data/companies.json").then((companies) => {
      const found = companies.find((company) => company.slug === slug);
      if (!found) {
        throw new Error("Company not found");
      }
      return found;
    });
  },
};
