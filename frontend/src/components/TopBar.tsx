import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Icon } from "./ui/Icon";

interface TopBarProps {
  onOpenDrawer?: () => void;
  title?: string;
  subtitle?: string;
  query?: string;
  onQueryChange?: (q: string) => void;
  onSearchSubmit?: () => void;
  showSearch?: boolean;
  action?: ReactNode;
}

function TopBar({
  onOpenDrawer,
  title,
  subtitle,
  query,
  onQueryChange,
  onSearchSubmit,
  showSearch = false,
  action,
}: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-3 md:py-4"
      style={{
        background: "color-mix(in oklch, var(--bg) 80%, transparent)",
        backdropFilter: "blur(16px) saturate(160%)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          aria-label="Open menu"
          className="md:hidden w-11 h-11 -ml-2 rounded-xl flex items-center justify-center text-xl"
          style={{ color: "var(--text-dim)" }}
          onClick={onOpenDrawer}
        >
          <Icon.Menu />
        </button>

        <div className="flex-1 min-w-0">
          {subtitle && (
            <div
              className="text-[10px] uppercase tracking-[.18em] font-mono"
              style={{ color: "var(--text-mute)" }}
            >
              {subtitle}
            </div>
          )}
          {title && (
            <h1 className="font-serif text-[22px] md:text-[28px] leading-tight tracking-tight text-white truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {showSearch && (
            <SearchInline
              query={query}
              onChange={onQueryChange}
              onSubmit={onSearchSubmit}
            />
          )}
          {action}
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden mt-3">
          <SearchInline
            query={query}
            onChange={onQueryChange}
            onSubmit={onSearchSubmit}
          />
        </div>
      )}
    </header>
  );
}

interface SearchInlineProps {
  query?: string;
  onChange?: (q: string) => void;
  onSubmit?: () => void;
}

function SearchInline({ query, onChange, onSubmit }: SearchInlineProps) {
  const [focus, setFocus] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full md:w-[340px] lg:w-[420px]"
    >
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[17px] pointer-events-none"
        style={{
          color: focus ? "var(--accent)" : "var(--text-mute)",
          transition: "color .2s",
        }}
      >
        <Icon.Search />
      </span>
      <input
        type="search"
        value={query ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Search a manga, manhwa, webtoon…"
        className="w-full h-11 pl-11 pr-4 rounded-full text-[14px] text-white
                   placeholder:text-[var(--text-mute)]
                   focus:outline-none transition-all duration-200"
        style={{
          background: focus ? "var(--surface-2)" : "var(--surface)",
          border: `1px solid ${
            focus
              ? "color-mix(in oklch, var(--accent) 50%, transparent)"
              : "var(--border)"
          }`,
          boxShadow: focus
            ? "0 0 0 4px color-mix(in oklch, var(--accent) 12%, transparent)"
            : "none",
        }}
      />
    </form>
  );
}

export default TopBar;