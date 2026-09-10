export interface CompanyBranding {
  primaryColor: string;
  logoUrl: string | null;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  location: string | null;
  isPublic: boolean;
  branding: CompanyBranding;
}
