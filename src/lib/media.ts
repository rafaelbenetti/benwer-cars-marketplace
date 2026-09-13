const LOCALSTACK_ORIGIN = /^https?:\/\/(?:localhost|127\.0\.0\.1):4566/i;

export function isLocalStackMediaSrc(src: string): boolean {
  return src.startsWith("/localstack/") || LOCALSTACK_ORIGIN.test(src);
}

export function shouldSkipImageOptimization(src: string): boolean {
  return isLocalStackMediaSrc(src) || /\.svg(?:$|\?)/i.test(src);
}

export function toPublicMediaSrc(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (LOCALSTACK_ORIGIN.test(trimmed)) {
    const path = trimmed.replace(LOCALSTACK_ORIGIN, "");
    return path.startsWith("/") ? `/localstack${path}` : `/localstack/${path}`;
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}
