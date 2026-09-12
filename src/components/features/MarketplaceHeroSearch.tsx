import { Suspense } from "react";
import {
  MarketplaceSearchBar,
  MarketplaceSearchBarFallback,
} from "./MarketplaceSearchBar";

export function MarketplaceHeroSearch() {
  return (
    <Suspense fallback={<MarketplaceSearchBarFallback />}>
      <MarketplaceSearchBar />
    </Suspense>
  );
}
