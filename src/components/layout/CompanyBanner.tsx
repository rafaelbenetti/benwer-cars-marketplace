import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyBannerProps {
  name: string;
  description?: string | null;
  location?: string | null;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function CompanyBanner({
  name,
  description,
  location,
  backHref,
  backLabel,
  className,
}: CompanyBannerProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden border-b border-border bg-primary/5",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-12 md:px-6 md:py-14 lg:px-8">
        {backHref && backLabel ? (
          <Link
            href={backHref}
            className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} aria-hidden />
            {backLabel}
          </Link>
        ) : null}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {name}
          </h1>
          {description ? (
            <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
          {location ? (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={16} aria-hidden />
              {location}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
