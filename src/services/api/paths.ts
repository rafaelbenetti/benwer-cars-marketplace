export const PublicApiPaths = {
  companies: "/v1/public/companies",
  company: (slug: string) =>
    `/v1/public/companies/${encodeURIComponent(slug)}`,
  vehicles: (slug: string) =>
    `/v1/public/companies/${encodeURIComponent(slug)}/vehicles`,
  vehicle: (slug: string, id: string) =>
    `/v1/public/companies/${encodeURIComponent(slug)}/vehicles/${encodeURIComponent(id)}`,
  availability: (slug: string) =>
    `/v1/public/companies/${encodeURIComponent(slug)}/availability`,
  reservations: (slug: string) =>
    `/v1/public/companies/${encodeURIComponent(slug)}/reservations`,
  reservationByToken: (token: string) =>
    `/v1/public/reservations/${encodeURIComponent(token)}`,
} as const;
