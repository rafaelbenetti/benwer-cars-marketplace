import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_ORIGIN: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_MARKETPLACE_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_ENV: z.enum(["local", "staging", "production"]).default("local"),
  },
  runtimeEnv: {
    API_ORIGIN: process.env.API_ORIGIN,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_MARKETPLACE_DOMAIN: process.env.NEXT_PUBLIC_MARKETPLACE_DOMAIN,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },
});
