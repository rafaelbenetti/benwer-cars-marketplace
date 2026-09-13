import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fallbackSpec = path.join(root, "openapi/public.json");
const outFile = path.join(root, "src/services/api/schema.d.ts");

const candidates = [
  process.env.API_SWAGGER_URL,
  process.env.API_ORIGIN
    ? `${process.env.API_ORIGIN.replace(/\/$/, "")}/swagger/doc.json`
    : null,
  "http://localhost:8080/swagger/doc.json",
].filter(Boolean);

async function resolveSpecInput() {
  for (const url of candidates) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) {
        continue;
      }

      const spec = await response.json();
      const paths = spec && typeof spec === "object" && "paths" in spec ? spec.paths : {};
      const hasPublic = Object.keys(paths ?? {}).some((route) => route.includes("/public/"));
      if (hasPublic) {
        return url;
      }
    } catch {
      /* keep looking */
    }
  }

  return fallbackSpec;
}

const input = await resolveSpecInput();
const result = spawnSync(
  "npx",
  ["openapi-typescript", input, "-o", outFile],
  { stdio: "inherit", cwd: root },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`generated ${path.relative(root, outFile)} from ${input}`);
