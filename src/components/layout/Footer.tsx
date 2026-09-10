import Link from "next/link";
import { NavRoutes } from "@/enums";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-muted mt-auto">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-subtle-foreground">
          &copy; {year} Benwer Cars. All rights reserved.
        </p>
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          <Link
            href={NavRoutes.HOME}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href={NavRoutes.COMPANIES}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Companies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
