import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  variant?: "page" | "compact";
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon,
  variant = "page",
  className,
}: EmptyStateProps) {
  const compact = variant === "compact";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact
          ? "gap-2 px-4 py-8"
          : "gap-4 rounded-2xl border border-primary/15 bg-gradient-to-br from-surface via-surface to-primary/10 px-6 py-14 shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-primary/10 text-primary",
          compact ? "h-12 w-12 rounded-xl" : "h-16 w-16 rounded-2xl",
        )}
      >
        {icon ?? <Search size={compact ? 22 : 28} aria-hidden />}
      </div>
      <div className="flex max-w-md flex-col gap-1.5">
        <p
          className={cn(
            "font-semibold tracking-tight text-foreground",
            compact ? "text-sm" : "text-lg",
          )}
        >
          {title}
        </p>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      ) : actionLabel && onAction ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </div>
  );
}
