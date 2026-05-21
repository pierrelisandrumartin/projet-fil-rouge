import type { ReactNode } from "react";

interface ChipProps {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  count?: number;
}

function Chip({ active, children, onClick, count }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 h-9 text-[13px] font-medium
                 whitespace-nowrap transition-all duration-200
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={
        active
          ? {
              background: "var(--accent)",
              color: "white",
              boxShadow:
                "0 4px 16px -6px color-mix(in oklch, var(--accent) 60%, transparent)",
            }
          : {
              background: "var(--surface)",
              color: "var(--text-dim)",
              border: "1px solid var(--border)",
            }
      }
    >
      {children}
      {count != null && (
        <span className="text-[10px] font-mono opacity-70 tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}

export default Chip;