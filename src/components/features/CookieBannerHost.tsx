"use client";

import dynamic from "next/dynamic";

export const CookieBannerHost = dynamic(
  () => import("./CookieBanner").then((mod) => mod.CookieBanner),
  { ssr: false },
);
