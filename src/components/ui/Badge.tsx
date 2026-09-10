import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ReservationStatus, VehicleStatus } from "@/enums";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-muted text-muted-foreground",
        success: "bg-success-soft text-success",
        info: "bg-info-soft text-info",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge> & {
    dot?: boolean;
  };

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badge({ variant }), className)} {...props}>
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success",
            variant === "info" && "bg-info",
            variant === "warning" && "bg-warning",
            variant === "danger" && "bg-danger",
            (!variant || variant === "default") && "bg-muted-foreground",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

const RESERVATION_STATUS_VARIANT = {
  draft: "default",
  confirmed: "info",
  active: "success",
  completed: "default",
  cancelled: "danger",
} as const satisfies Record<ReservationStatus, VariantProps<typeof badge>["variant"]>;

const VEHICLE_STATUS_VARIANT = {
  available: "success",
  reserved: "info",
  rented: "warning",
  maintenance: "danger",
} as const satisfies Record<VehicleStatus, VariantProps<typeof badge>["variant"]>;

interface StatusBadgeProps {
  status: ReservationStatus | VehicleStatus;
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant =
    (RESERVATION_STATUS_VARIANT as Record<string, VariantProps<typeof badge>["variant"]>)[status] ??
    (VEHICLE_STATUS_VARIANT as Record<string, VariantProps<typeof badge>["variant"]>)[status] ??
    "default";

  return (
    <Badge variant={variant} dot className={className}>
      {label}
    </Badge>
  );
}
