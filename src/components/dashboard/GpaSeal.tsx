interface GpaSealProps {
  gpa: number;
  gpaMax: number;
}

// A circular "ledger stamp" — the dashboard's signature element.
// Tick marks read like a transcript dial; the gold ring fills
// proportionally to GPA / max.
export function GpaSeal({ gpa, gpaMax }: GpaSealProps) {
  const pct = Math.min(gpa / gpaMax, 1);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const ticks = Array.from({ length: 24 });

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        {/* tick marks */}
        {ticks.map((_, i) => {
          const angle = (i / ticks.length) * 360;
          return (
            <line
              key={i}
              x1={40}
              y1={4}
              x2={40}
              y2={8}
              stroke="#E4E2DA"
              strokeWidth={1}
              transform={`rotate(${angle} 40 40)`}
            />
          );
        })}
        {/* track */}
        <circle cx={40} cy={40} r={radius} fill="none" stroke="#EFEDE6" strokeWidth={5} />
        {/* progress */}
        <circle
          cx={40}
          cy={40}
          r={radius}
          fill="none"
          stroke="#C9A227"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-serif text-lg font-semibold leading-none text-[#16233F]">
          {gpa.toFixed(2)}
        </span>
        <span className="mt-0.5 text-[10px] uppercase tracking-wide text-[#9CA3AF]">
          / {gpaMax.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
