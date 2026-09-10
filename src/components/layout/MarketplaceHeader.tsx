import Link from "next/link";
import { NavRoutes } from "@/enums";
import { cn } from "@/lib/utils";

interface MarketplaceHeaderProps {
  className?: string;
}

export function MarketplaceHeader({ className }: MarketplaceHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href={NavRoutes.HOME}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          Benwer Cars
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main navigation">
          <Link
            href={NavRoutes.COMPANIES}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Companies
          </Link>
        </nav>
      </div>
    </header>
  );
}
