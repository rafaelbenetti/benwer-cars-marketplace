import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyBannerProps {
  name: string;
  description?: string | null;
  location?: string | null;
  className?: string;
}

export function CompanyBanner({
  name,
  description,
  location,
  className,
}: CompanyBannerProps) {
  return (
    <section
      className={cn(
        "bg-primary/5 border-b border-border py-10",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {name}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            {description}
          </p>
        ) : null}
        {location ? (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-subtle-foreground">
            <MapPin size={14} aria-hidden />
            {location}
          </p>
        ) : null}
      </div>
    </section>
  );
}
