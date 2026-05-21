import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px] gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-[15px] gap-2",
};

const variants: Record<Variant, string> = {
  primary: "text-white border border-transparent",
  ghost: "text-[var(--text-dim)] hover:text-white border border-transparent hover:bg-white/5",
  outline: "text-white border bg-transparent hover:bg-white/5",
  danger: "text-[#FCA5A5] border border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.1)]",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const styleP =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          boxShadow:
            "0 6px 24px -8px color-mix(in oklch, var(--accent) 60%, transparent), inset 0 1px 0 rgba(255,255,255,.15)",
        }
      : variant === "outline"
      ? { borderColor: "var(--border)" }
      : {};

  return (
    <button
      className={`relative inline-flex items-center justify-center font-medium rounded-xl
                  transition-all duration-200 active:scale-[0.98]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${sizes[size]} ${variants[variant]} ${className}`}
      style={styleP}
      {...props}
    >
      {icon && <span className="text-lg leading-none -ml-0.5">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;