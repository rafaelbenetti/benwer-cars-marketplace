import { Suspense } from "react";
import {
  MarketplaceSearchBar,
  MarketplaceSearchBarFallback,
} from "./MarketplaceSearchBar";

interface MarketplaceHeroSearchProps {
  className?: string;
}

export function MarketplaceHeroSearch({ className }: MarketplaceHeroSearchProps) {
  return (
    <Suspense fallback={<MarketplaceSearchBarFallback className={className} />}>
      <MarketplaceSearchBar className={className} />
    </Suspense>
  );
}
