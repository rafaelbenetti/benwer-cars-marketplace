import { env } from "@/env";

const LOCALSTACK_ORIGIN = /^https?:\/\/(?:localhost|127\.0\.0\.1):4566/i;

export function isLocalStackMediaSrc(src: string): boolean {
  return src.startsWith("/localstack/") || LOCALSTACK_ORIGIN.test(src);
}

export function shouldSkipImageOptimization(src: string): boolean {
  return (
    isLocalStackMediaSrc(src) ||
    /\.svg(?:$|\?)/i.test(src) ||
    /amazonaws\.com/i.test(src) ||
    /[?&]X-Amz-/i.test(src)
  );
}

export function toPublicMediaSrc(
  value: string,
  mediaOrigin = env.NEXT_PUBLIC_MEDIA_ORIGIN,
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (LOCALSTACK_ORIGIN.test(trimmed)) {
    const path = trimmed.replace(LOCALSTACK_ORIGIN, "");
    return path.startsWith("/") ? `/localstack${path}` : `/localstack/${path}`;
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const origin = mediaOrigin?.trim().replace(/\/+$/, "");
  if (!origin) {
    return undefined;
  }

  const s3 = trimmed.match(/^s3:\/\/[^/]+\/(.+)$/i);
  const key = s3?.[1] ?? trimmed;
  const path = key.startsWith("/") ? key : `/${key}`;
  return `${origin}${path}`;
}
