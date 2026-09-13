import { Skeleton } from "@/components/ui/Skeleton";

export function CompanyMapSkeleton() {
  return (
    <div className="relative h-full min-h-80 overflow-hidden rounded-xl border border-border bg-surface">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute inset-0 flex items-end justify-between p-4">
        <Skeleton className="h-8 w-28" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
