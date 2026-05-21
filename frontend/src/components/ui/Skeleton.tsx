import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

function Skeleton({ className = "", style = {} }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: "rgba(255,255,255,0.04)", ...style }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="rounded-2xl w-full" style={{ aspectRatio: "2/3" }} />
      <Skeleton className="rounded h-4 w-3/4" />
      <Skeleton className="rounded h-3 w-1/2" />
    </div>
  );
}

export default Skeleton;