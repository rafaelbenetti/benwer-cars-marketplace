export function isLocalStackMediaSrc(src: string): boolean {
  return (
    src.startsWith("/localstack/") ||
    /^https?:\/\/(?:localhost|127\.0\.0\.1):4566\//i.test(src)
  );
}

export function shouldSkipImageOptimization(src: string): boolean {
  return isLocalStackMediaSrc(src) || /\.svg(?:$|\?)/i.test(src);
}
