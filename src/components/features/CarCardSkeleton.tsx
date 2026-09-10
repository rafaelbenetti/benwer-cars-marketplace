import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface CarCardSkeletonProps {
  className?: string;
}

export function CarCardSkeleton({ className }: CarCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-surface overflow-hidden",
        className,
      )}
    >
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-24 mt-1" />
      </div>
    </div>
  );
}
