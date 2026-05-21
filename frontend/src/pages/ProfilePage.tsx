import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getMyLibrary } from "../services/api";
import type { LibraryItem, UserResponse } from "../types/api";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import Button from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

interface ProfilePageProps {
  onOpenDrawer?: () => void;
}

function ProfilePage({ onOpenDrawer }: ProfilePageProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userData, libraryData] = await Promise.all([
          getCurrentUser(),
          getMyLibrary(),
        ]);
        if (cancelled) return;
        setUser(userData);
        setLibrary(libraryData);
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (!cancelled) setError("Failed to load your profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Computed stats
  const stats = computeStats(library);

  return (
    <div className="text-white">
      <TopBar
        onOpenDrawer={onOpenDrawer}
        subtitle="Account"
        title="Profile"
      />

      {loading && (
        <p className="mt-6 text-center" style={{ color: "var(--text-mute)" }}>
          Loading...
        </p>
      )}

      {error && (
        <p className="mt-6 text-center text-red-400" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && user && (
        <div className="flex flex-col gap-10 mt-6">
          {/* Header */}
          <div
            className="flex flex-col md:flex-row md:items-end gap-6 p-6 md:p-8 rounded-3xl"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="relative">
              <div
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-white font-serif text-[44px]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-2))",
                  boxShadow:
                    "0 12px 32px -10px color-mix(in oklch, var(--accent) 60%, transparent)",
                }}
                aria-hidden="true"
              >
                {getInitials(user.username)}
              </div>
            </div>

            <div className="flex-1">
              <div
                className="text-[10px] uppercase tracking-[.24em] font-mono"
                style={{ color: "var(--text-mute)" }}
              >
                Reader since {formatYear(user.createdAt)}
              </div>
              <h1 className="font-serif text-[32px] md:text-[40px] leading-tight text-white mt-1">
                {user.username}
              </h1>
              <div
                className="text-[14px] mt-1"
                style={{ color: "var(--text-dim)" }}
              >
                {user.email}
              </div>
            </div>
          </div>

          {/* Stats */}
          <section>
            <SectionHeading kicker="Your reading" title="Library overview" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-5">
              <StatCard label="Series on shelf" value={stats.total} accent />
              <StatCard label="Now reading" value={stats.reading} />
              <StatCard label="Completed" value={stats.completed} />
              <StatCard label="Total chapters" value={stats.chapters} mono />
            </div>
          </section>

          {/* Account actions */}
          <section>
            <SectionHeading kicker="Settings" title="Account" />
            <div
              className="mt-5 rounded-2xl divide-y"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderColor: "var(--border)",
              }}
            >
              <AccountRow
                icon={<Icon.Lock />}
                label="Change password"
                hint="Coming soon"
                disabled
              />
              <AccountRow
                icon={<Icon.Logout />}
                label="Log out"
                hint="Sign out from this device"
                onClick={handleLogout}
                danger
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// ── Stat card (réutilisé de MyList) ─────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  accent?: boolean;
  mono?: boolean;
}

function StatCard({ label, value, accent, mono }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-3.5 md:p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: accent
          ? "color-mix(in oklch, var(--accent) 12%, var(--surface))"
          : "var(--surface)",
        border: `1px solid ${
          accent
            ? "color-mix(in oklch, var(--accent) 30%, transparent)"
            : "var(--border)"
        }`,
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[.18em] font-mono"
        style={{ color: "var(--text-mute)" }}
      >
        {label}
      </div>
      <div
        className={`mt-1 text-[28px] md:text-[32px] leading-none tabular-nums tracking-tight ${
          mono ? "font-mono" : "font-serif"
        }`}
        style={{ color: accent ? "var(--accent)" : "white" }}
      >
        {value}
      </div>
    </div>
  );
}

// ── Section heading ─────────────────────────────────────────────────────
function SectionHeading({
  kicker,
  title,
}: {
  kicker?: string;
  title: string;
}) {
  return (
    <div>
      {kicker && (
        <div
          className="text-[10px] uppercase tracking-[.18em] font-mono"
          style={{ color: "var(--text-mute)" }}
        >
          {kicker}
        </div>
      )}
      <h2 className="font-serif text-[24px] md:text-[28px] leading-tight tracking-tight text-white mt-1">
        {title}
      </h2>
    </div>
  );
}

// ── Account row ─────────────────────────────────────────────────────────
interface AccountRowProps {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

function AccountRow({
  icon,
  label,
  hint,
  onClick,
  disabled,
  danger,
}: AccountRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      className="w-full flex items-center gap-4 p-4 text-left transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 enabled:hover:bg-white/[0.02]"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{
          background: danger
            ? "rgba(239, 68, 68, 0.1)"
            : "var(--surface-2)",
          color: danger ? "#FCA5A5" : "var(--text-dim)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[14px] font-medium"
          style={{ color: danger ? "#FCA5A5" : "white" }}
        >
          {label}
        </div>
        {hint && (
          <div className="text-[12px]" style={{ color: "var(--text-mute)" }}>
            {hint}
          </div>
        )}
      </div>
      {onClick && !disabled && (
        <span
          className="text-[16px]"
          style={{ color: "var(--text-mute)" }}
          aria-hidden="true"
        >
          →
        </span>
      )}
    </button>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatYear(iso: string): string {
  try {
    return new Date(iso).getFullYear().toString();
  } catch {
    return "—";
  }
}

interface Stats {
  total: number;
  reading: number;
  completed: number;
  chapters: number;
}

function computeStats(library: LibraryItem[]): Stats {
  let reading = 0;
  let completed = 0;
  let chapters = 0;

  for (const item of library) {
    chapters += item.currentChapter;
    if (item.totalChapters > 0 && item.currentChapter >= item.totalChapters) {
      completed++;
    } else if (item.currentChapter > 0 || item.currentVolume > 0) {
      reading++;
    }
  }

  return {
    total: library.length,
    reading,
    completed,
    chapters,
  };
}

export default ProfilePage;