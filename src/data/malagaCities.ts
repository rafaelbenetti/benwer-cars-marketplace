import {
  getCityCoordinates,
  type CityCoordinates,
} from "./malagaCityCoordinates";

export interface MalagaCity {
  slug: string;
  nameEn: string;
  nameEs: string;
}

export type MappableMalagaCity = MalagaCity & CityCoordinates;

export const DEFAULT_CITY_SLUG = "malaga";

export function isProvinceWideLocation(slug: string | null | undefined): boolean {
  return !slug || slug === DEFAULT_CITY_SLUG;
}

export function toApiLocation(slug: string | null | undefined): string | undefined {
  if (!slug || isProvinceWideLocation(slug)) {
    return undefined;
  }

  return slug;
}

export const FEATURED_CITY_SLUGS = [
  "malaga",
  "marbella",
  "benalmadena",
  "torremolinos",
  "fuengirola",
  "estepona",
  "nerja",
  "ronda",
] as const;

export const MALAGA_CITIES: MalagaCity[] = [
  { slug: "alameda", nameEn: "Alameda", nameEs: "Alameda" },
  { slug: "alcaucin", nameEn: "Alcaucin", nameEs: "Alcaucín" },
  { slug: "alfarnate", nameEn: "Alfarnate", nameEs: "Alfarnate" },
  { slug: "alfarnatejo", nameEn: "Alfarnatejo", nameEs: "Alfarnatejo" },
  { slug: "algarrobo", nameEn: "Algarrobo", nameEs: "Algarrobo" },
  { slug: "algatocin", nameEn: "Algatocin", nameEs: "Algatocín" },
  { slug: "alhaurin-de-la-torre", nameEn: "Alhaurin de la Torre", nameEs: "Alhaurín de la Torre" },
  { slug: "alhaurin-el-grande", nameEn: "Alhaurin el Grande", nameEs: "Alhaurín el Grande" },
  { slug: "almachar", nameEn: "Almachar", nameEs: "Almáchar" },
  { slug: "almargen", nameEn: "Almargen", nameEs: "Almargen" },
  { slug: "almogia", nameEn: "Almogia", nameEs: "Almogía" },
  { slug: "alora", nameEn: "Alora", nameEs: "Álora" },
  { slug: "alozaina", nameEn: "Alozaina", nameEs: "Alozaina" },
  { slug: "alpandeire", nameEn: "Alpandeire", nameEs: "Alpandeire" },
  { slug: "antequera", nameEn: "Antequera", nameEs: "Antequera" },
  { slug: "archez", nameEn: "Archez", nameEs: "Árchez" },
  { slug: "archidona", nameEn: "Archidona", nameEs: "Archidona" },
  { slug: "ardales", nameEn: "Ardales", nameEs: "Ardales" },
  { slug: "arenas", nameEn: "Arenas", nameEs: "Arenas" },
  { slug: "arriate", nameEn: "Arriate", nameEs: "Arriate" },
  { slug: "atajate", nameEn: "Atajate", nameEs: "Atajate" },
  { slug: "benadalid", nameEn: "Benadalid", nameEs: "Benadalid" },
  { slug: "benahavis", nameEn: "Benahavis", nameEs: "Benahavís" },
  { slug: "benalauria", nameEn: "Benalauria", nameEs: "Benalauría" },
  { slug: "benalmadena", nameEn: "Benalmadena", nameEs: "Benalmádena" },
  { slug: "benamargosa", nameEn: "Benamargosa", nameEs: "Benamargosa" },
  { slug: "benamocarra", nameEn: "Benamocarra", nameEs: "Benamocarra" },
  { slug: "benaojan", nameEn: "Benaojan", nameEs: "Benaoján" },
  { slug: "benarraba", nameEn: "Benarraba", nameEs: "Benarrabá" },
  { slug: "el-borge", nameEn: "El Borge", nameEs: "El Borge" },
  { slug: "el-burgo", nameEn: "El Burgo", nameEs: "El Burgo" },
  { slug: "campillos", nameEn: "Campillos", nameEs: "Campillos" },
  { slug: "canillas-de-aceituno", nameEn: "Canillas de Aceituno", nameEs: "Canillas de Aceituno" },
  { slug: "canillas-de-albaida", nameEn: "Canillas de Albaida", nameEs: "Canillas de Albaida" },
  { slug: "canete-la-real", nameEn: "Canete la Real", nameEs: "Cañete la Real" },
  { slug: "carratraca", nameEn: "Carratraca", nameEs: "Carratraca" },
  { slug: "cartajima", nameEn: "Cartajima", nameEs: "Cartajima" },
  { slug: "cartama", nameEn: "Cartama", nameEs: "Cártama" },
  { slug: "casabermeja", nameEn: "Casabermeja", nameEs: "Casabermeja" },
  { slug: "casarabonela", nameEn: "Casarabonela", nameEs: "Casarabonela" },
  { slug: "casares", nameEn: "Casares", nameEs: "Casares" },
  { slug: "coin", nameEn: "Coin", nameEs: "Coín" },
  { slug: "colmenar", nameEn: "Colmenar", nameEs: "Colmenar" },
  { slug: "comares", nameEn: "Comares", nameEs: "Comares" },
  { slug: "competa", nameEn: "Competa", nameEs: "Cómpeta" },
  { slug: "cortes-de-la-frontera", nameEn: "Cortes de la Frontera", nameEs: "Cortes de la Frontera" },
  { slug: "cuevas-bajas", nameEn: "Cuevas Bajas", nameEs: "Cuevas Bajas" },
  { slug: "cuevas-de-san-marcos", nameEn: "Cuevas de San Marcos", nameEs: "Cuevas de San Marcos" },
  { slug: "cuevas-del-becerro", nameEn: "Cuevas del Becerro", nameEs: "Cuevas del Becerro" },
  { slug: "cutar", nameEn: "Cutar", nameEs: "Cútar" },
  { slug: "estepona", nameEn: "Estepona", nameEs: "Estepona" },
  { slug: "farajan", nameEn: "Farajan", nameEs: "Faraján" },
  { slug: "frigiliana", nameEn: "Frigiliana", nameEs: "Frigiliana" },
  { slug: "fuengirola", nameEn: "Fuengirola", nameEs: "Fuengirola" },
  { slug: "fuente-de-piedra", nameEn: "Fuente de Piedra", nameEs: "Fuente de Piedra" },
  { slug: "gaucin", nameEn: "Gaucin", nameEs: "Gaucín" },
  { slug: "genalguacil", nameEn: "Genalguacil", nameEs: "Genalguacil" },
  { slug: "guaro", nameEn: "Guaro", nameEs: "Guaro" },
  { slug: "humilladero", nameEn: "Humilladero", nameEs: "Humilladero" },
  { slug: "igualeja", nameEn: "Igualeja", nameEs: "Igualeja" },
  { slug: "istan", nameEn: "Istan", nameEs: "Istán" },
  { slug: "iznate", nameEn: "Iznate", nameEs: "Iznate" },
  { slug: "jimera-de-libar", nameEn: "Jimera de Libar", nameEs: "Jimera de Líbar" },
  { slug: "jubrique", nameEn: "Jubrique", nameEs: "Jubrique" },
  { slug: "juzcar", nameEn: "Juzcar", nameEs: "Júzcar" },
  { slug: "macharaviaya", nameEn: "Macharaviaya", nameEs: "Macharaviaya" },
  { slug: "malaga", nameEn: "Málaga", nameEs: "Málaga" },
  { slug: "manilva", nameEn: "Manilva", nameEs: "Manilva" },
  { slug: "marbella", nameEn: "Marbella", nameEs: "Marbella" },
  { slug: "mijas", nameEn: "Mijas", nameEs: "Mijas" },
  { slug: "moclinejo", nameEn: "Moclinejo", nameEs: "Moclinejo" },
  { slug: "mollina", nameEn: "Mollina", nameEs: "Mollina" },
  { slug: "monda", nameEn: "Monda", nameEs: "Monda" },
  { slug: "montecorto", nameEn: "Montecorto", nameEs: "Montecorto" },
  { slug: "montejaque", nameEn: "Montejaque", nameEs: "Montejaque" },
  { slug: "nerja", nameEn: "Nerja", nameEs: "Nerja" },
  { slug: "ojen", nameEn: "Ojen", nameEs: "Ojén" },
  { slug: "parauta", nameEn: "Parauta", nameEs: "Parauta" },
  { slug: "periana", nameEn: "Periana", nameEs: "Periana" },
  { slug: "pizarra", nameEn: "Pizarra", nameEs: "Pizarra" },
  { slug: "pujerra", nameEn: "Pujerra", nameEs: "Pujerra" },
  { slug: "rincon-de-la-victoria", nameEn: "Rincon de la Victoria", nameEs: "Rincón de la Victoria" },
  { slug: "riogordo", nameEn: "Riogordo", nameEs: "Riogordo" },
  { slug: "ronda", nameEn: "Ronda", nameEs: "Ronda" },
  { slug: "salares", nameEn: "Salares", nameEs: "Salares" },
  { slug: "sayalonga", nameEn: "Sayalonga", nameEs: "Sayalonga" },
  { slug: "sedella", nameEn: "Sedella", nameEs: "Sedella" },
  { slug: "serrato", nameEn: "Serrato", nameEs: "Serrato" },
  { slug: "sierra-de-yeguas", nameEn: "Sierra de Yeguas", nameEs: "Sierra de Yeguas" },
  { slug: "teba", nameEn: "Teba", nameEs: "Teba" },
  { slug: "tolox", nameEn: "Tolox", nameEs: "Tolox" },
  { slug: "torremolinos", nameEn: "Torremolinos", nameEs: "Torremolinos" },
  { slug: "torrox", nameEn: "Torrox", nameEs: "Torrox" },
  { slug: "totalan", nameEn: "Totalan", nameEs: "Totalán" },
  { slug: "valle-de-abdalajis", nameEn: "Valle de Abdalajis", nameEs: "Valle de Abdalajís" },
  { slug: "velez-malaga", nameEn: "Velez-Malaga", nameEs: "Vélez-Málaga" },
  { slug: "villanueva-de-algaidas", nameEn: "Villanueva de Algaidas", nameEs: "Villanueva de Algaidas" },
  { slug: "villanueva-de-la-concepcion", nameEn: "Villanueva de la Concepcion", nameEs: "Villanueva de la Concepción" },
  { slug: "villanueva-de-tapia", nameEn: "Villanueva de Tapia", nameEs: "Villanueva de Tapia" },
  { slug: "villanueva-del-rosario", nameEn: "Villanueva del Rosario", nameEs: "Villanueva del Rosario" },
  { slug: "villanueva-del-trabuco", nameEn: "Villanueva del Trabuco", nameEs: "Villanueva del Trabuco" },
  { slug: "vinuela", nameEn: "Vinuela", nameEs: "Viñuela" },
  { slug: "yunquera", nameEn: "Yunquera", nameEs: "Yunquera" },
];

function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function getCityBySlug(slug: string): MalagaCity | null {
  return MALAGA_CITIES.find((city) => city.slug === slug) ?? null;
}

export function getCityByName(value: string | null | undefined): MalagaCity | null {
  if (!value) {
    return null;
  }

  const normalized = normalizeSearch(value.trim());
  if (!normalized) {
    return null;
  }

  return (
    MALAGA_CITIES.find((city) => city.slug === normalized) ??
    MALAGA_CITIES.find(
      (city) =>
        normalizeSearch(city.nameEn) === normalized ||
        normalizeSearch(city.nameEs) === normalized,
    ) ??
    null
  );
}

export function getMappableCity(slug: string): MappableMalagaCity | null {
  const city = getCityBySlug(slug);
  const coordinates = getCityCoordinates(slug);
  if (!city || !coordinates) {
    return null;
  }

  return { ...city, ...coordinates };
}

export function resolveCitySlug(slug: string | null): string {
  const trimmed = slug?.trim();
  return trimmed ? trimmed : DEFAULT_CITY_SLUG;
}

export function getCityDisplayName(city: MalagaCity, locale: string): string {
  return locale === "es-ES" ? city.nameEs : city.nameEn;
}

export function filterCities(query: string): MalagaCity[] {
  const normalized = normalizeSearch(query.trim());
  if (!normalized) {
    return MALAGA_CITIES;
  }

  const matches = normalized
    ? MALAGA_CITIES.filter((city) => {
        return (
          normalizeSearch(city.nameEn).includes(normalized) ||
          normalizeSearch(city.nameEs).includes(normalized) ||
          city.slug.includes(normalized)
        );
      })
    : MALAGA_CITIES;

  return [...matches].sort((a, b) => {
    const aProvince = isProvinceWideLocation(a.slug) ? 0 : 1;
    const bProvince = isProvinceWideLocation(b.slug) ? 0 : 1;
    return aProvince - bProvince;
  });
}
