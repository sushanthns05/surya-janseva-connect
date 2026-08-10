import { cn } from "@/lib/utils";
import {
  PRIORITY_TONE,
  STATUS_LABELS,
  STATUS_TONE,
  type ComplaintPriority,
  type ComplaintStatus,
} from "@/lib/civic";

export function StatusBadge({
  status,
  className,
}: {
  status: ComplaintStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_TONE[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        PRIORITY_TONE[priority],
      )}
    >
      {priority}
    </span>
  );
}
