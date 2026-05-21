import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: ReactNode;
  error?: string;
  hint?: ReactNode;
}

function Field({
  label,
  value,
  onChange,
  icon,
  error,
  hint,
  type = "text",
  ...rest
}: FieldProps) {
  const [focus, setFocus] = useState(false);

  return (
    <label className="block">
      <div
        className="text-[12px] font-medium mb-2 flex justify-between"
        style={{ color: "var(--text-dim)" }}
      >
        <span>{label}</span>
        {hint && (
          <span
            className="font-mono text-[11px]"
            style={{ color: "var(--text-mute)" }}
          >
            {hint}
          </span>
        )}
      </div>
      <div className="relative">
        {icon && (
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px]"
            style={{
              color: focus ? "var(--accent)" : "var(--text-mute)",
              transition: "color .2s",
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={`w-full h-12 rounded-xl text-[14px] text-white
                      placeholder:text-[var(--text-mute)]
                      focus:outline-none transition-all duration-200
                      ${icon ? "pl-11" : "pl-4"} pr-4`}
          style={{
            background: "var(--surface)",
            border: `1px solid ${
              error
                ? "#EF4444"
                : focus
                ? "color-mix(in oklch, var(--accent) 50%, transparent)"
                : "var(--border)"
            }`,
            boxShadow:
              focus && !error
                ? "0 0 0 4px color-mix(in oklch, var(--accent) 10%, transparent)"
                : "none",
          }}
          {...rest}
        />
      </div>
      {error && (
        <div className="text-[11px] mt-1.5" style={{ color: "#FCA5A5" }}>
          {error}
        </div>
      )}
    </label>
  );
}

export default Field;