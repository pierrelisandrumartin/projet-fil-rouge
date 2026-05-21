import type { ButtonHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md" | "lg";
type Variant = "surface" | "accent" | "ghost";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label: string;
  size?: Size;
  variant?: Variant;
}

const sizes: Record<Size, string> = {
  sm: "w-8 h-8 text-[15px]",
  md: "w-11 h-11 text-lg",
  lg: "w-12 h-12 text-xl",
};

const variants: Record<Variant, string> = {
  surface: "text-[var(--text-dim)] hover:text-white",
  accent: "text-white",
  ghost: "text-[var(--text-dim)] hover:text-white hover:bg-white/5",
};

function IconButton({
  children,
  label,
  size = "md",
  variant = "surface",
  className = "",
  ...props
}: IconButtonProps) {
  const styleX =
    variant === "surface"
      ? { background: "var(--surface-2)", border: "1px solid var(--border)" }
      : variant === "accent"
      ? {
          background: "var(--accent)",
          boxShadow:
            "0 4px 14px -4px color-mix(in oklch, var(--accent) 50%, transparent)",
        }
      : {};

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200
                  active:scale-95 hover:scale-[1.05]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${sizes[size]} ${variants[variant]} ${className}`}
      style={styleX}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;