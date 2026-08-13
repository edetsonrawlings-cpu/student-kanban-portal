import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: string; // hex used for the icon chip
  hint?: string;
  className?: string;
}

export function SummaryCard({
  label,
  value,
  icon: Icon,
  accent = "#2F4470",
  hint,
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-[#E4E2DA] bg-white p-5",
        className
      )}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${accent}1A` }}
      >
        <Icon size={20} strokeWidth={1.75} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">{label}</p>
        <p className="font-serif text-2xl leading-tight text-[#16233F]">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-[#6B7280]">{hint}</p>}
      </div>
    </div>
  );
}
