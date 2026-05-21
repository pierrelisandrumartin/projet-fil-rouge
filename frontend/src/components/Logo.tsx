interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

function Logo({ size = 32, withText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="rounded-lg flex items-center justify-center shrink-0"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #F43F5E, #FB7185)",
          boxShadow: "0 4px 12px -2px rgba(244, 63, 94, 0.4)",
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          width={size * 0.55}
          height={size * 0.55}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 4h12v17l-6-4-6 4z" />
        </svg>
      </div>
      {withText && (
        <div>
          <div className="font-serif text-[18px] leading-none tracking-tight text-white">
            Yomi
          </div>
          <div
            className="text-[10px] uppercase tracking-[.2em] mt-1"
            style={{
              color: "var(--text-mute)",
              fontFamily: "Geist Mono, ui-monospace, monospace",
            }}
          >
            Reading tracker
          </div>
        </div>
      )}
    </div>
  );
}

export default Logo;