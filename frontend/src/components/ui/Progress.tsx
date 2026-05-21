interface ProgressProps {
  value: number;
  total: number;
  accent?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

function Progress({
  value,
  total,
  accent = true,
  showLabel = false,
  size = "md",
}: ProgressProps) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const h = { sm: 3, md: 4, lg: 6 }[size];

  return (
    <div className="w-full">
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: h, background: "rgba(255,255,255,0.07)" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: accent
              ? "linear-gradient(90deg, var(--accent), var(--accent-2))"
              : "rgba(255,255,255,.5)",
            boxShadow: accent
              ? "0 0 12px color-mix(in oklch, var(--accent) 60%, transparent)"
              : "none",
          }}
        />
      </div>
      {showLabel && (
        <div
          className="flex justify-between mt-1.5 text-[11px] font-mono"
          style={{ color: "var(--text-dim)" }}
        >
          <span>
            {value} / {total} ch.
          </span>
          <span
            style={{
              color: pct === 100 ? "var(--accent)" : "var(--text-mute)",
            }}
          >
            {pct}%
          </span>
        </div>
      )}
    </div>
  );
}

export default Progress;
