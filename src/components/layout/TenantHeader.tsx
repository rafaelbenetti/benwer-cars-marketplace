import Link from "next/link";
import { cn } from "@/lib/utils";

interface TenantHeaderProps {
  companyName: string;
  logoUrl?: string | null;
  className?: string;
}

export function TenantHeader({
  companyName,
  logoUrl,
  className,
}: TenantHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              className="h-7 w-auto object-contain"
            />
          ) : null}
          {companyName}
        </Link>
      </div>
    </header>
  );
}
