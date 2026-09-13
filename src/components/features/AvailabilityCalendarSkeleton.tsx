import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export function AvailabilityCalendarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MonthSkeleton />
        <MonthSkeleton className="hidden md:block" />
      </div>
    </div>
  );
}

function MonthSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="h-5 w-36" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
