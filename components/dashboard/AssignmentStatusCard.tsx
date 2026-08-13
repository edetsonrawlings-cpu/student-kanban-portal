import { CheckCircle2, CircleDashed, AlarmClockOff, FileCheck2 } from "lucide-react";
import { cn, formatDueDate } from "@/lib/utils";
import type { AssignmentStatus, AssignmentSummary } from "@/types";

const statusConfig: Record<
  AssignmentStatus,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  not_submitted: {
    label: "Not submitted",
    icon: CircleDashed,
    color: "#B8563F",
    bg: "#B8563F1A",
  },
  submitted: {
    label: "Submitted",
    icon: FileCheck2,
    color: "#2F4470",
    bg: "#2F44701A",
  },
  late: {
    label: "Late",
    icon: AlarmClockOff,
    color: "#B8563F",
    bg: "#B8563F1A",
  },
  graded: {
    label: "Graded",
    icon: CheckCircle2,
    color: "#4B7A6F",
    bg: "#4B7A6F1A",
  },
};

interface AssignmentStatusCardProps {
  assignment: AssignmentSummary;
}

export function AssignmentStatusCard({ assignment }: AssignmentStatusCardProps) {
  const config = statusConfig[assignment.status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E4E2DA] bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: config.bg }}
        >
          <Icon size={17} strokeWidth={1.75} style={{ color: config.color }} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#16233F]">{assignment.title}</p>
          <p className="mt-0.5 text-xs text-[#9CA3AF]">
            <span className="font-mono">{assignment.courseCode}</span> · Due{" "}
            {formatDueDate(assignment.dueDate)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {assignment.status === "graded" && (
          <span className="text-sm font-medium text-[#16233F]">
            {assignment.points}/{assignment.maxPoints}
          </span>
        )}
        <span
          className={cn("rounded-full px-2.5 py-1 text-xs font-medium")}
          style={{ color: config.color, backgroundColor: config.bg }}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}
