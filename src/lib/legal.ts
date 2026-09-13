export interface LegalSection {
  title: string;
  body: string;
}

export function readLegalSections(value: unknown): LegalSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as { title?: unknown; body?: unknown };
    if (typeof record.title !== "string" || typeof record.body !== "string") {
      return [];
    }

    const title = record.title.trim();
    const body = record.body.trim();
    if (!title || !body) {
      return [];
    }

    return [{ title, body }];
  });
}
