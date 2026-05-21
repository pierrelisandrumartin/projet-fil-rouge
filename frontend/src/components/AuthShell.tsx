import type { ReactNode } from "react";
import Logo from "./Logo";
import Cover from "./ui/Cover";

interface AuthShellProps {
  children: ReactNode;
  kicker?: string;
  title?: string;
  body?: string;
}

// Œuvres flottantes décoratives — placement et inclinaison fixes
const FLOATING_COVERS = [
  { title: "Shadow Weaver", type: "Manga", x: "6%", y: "8%", w: 110, r: -8 },
  { title: "Crimson Echo", type: "Manhwa", x: "60%", y: "4%", w: 130, r: 6 },
  {
    title: "Halcyon Drift",
    type: "Webtoon",
    x: "28%",
    y: "36%",
    w: 150,
    r: -4,
  },
  { title: "Mercury Bloom", type: "Manhua", x: "70%", y: "40%", w: 100, r: 10 },
  { title: "Pale Saturn", type: "Manga", x: "8%", y: "62%", w: 120, r: 4 },
  { title: "Auric Knight", type: "Manga", x: "55%", y: "68%", w: 140, r: -7 },
];

function AuthShell({ children, kicker, title, body }: AuthShellProps) {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ background: "var(--bg)" }}
    >
      {/* Panneau décoratif — desktop only */}
      <div className="hidden lg:flex md:w-[44%] lg:w-[50%] relative overflow-hidden items-end p-12 lg:p-16">
        <div className="absolute inset-0" aria-hidden="true">
          {/* Gradient radial coloré */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(80% 60% at 20% 30%, color-mix(in oklch, var(--accent) 40%, transparent), transparent 60%),
                radial-gradient(70% 70% at 80% 80%, color-mix(in oklch, var(--accent-2) 35%, transparent), transparent 65%),
                var(--surface)
              `,
            }}
          />

          {/* Grille subtile */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="auth-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0H0v40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>

          {/* Couvertures flottantes */}
          {FLOATING_COVERS.map((c, i) => (
            <div
              key={i}
              className="absolute opacity-50"
              style={{
                left: c.x,
                top: c.y,
                width: c.w,
                transform: `rotate(${c.r}deg)`,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 30px 60px -20px rgba(0,0,0,.6)",
              }}
            >
              <Cover
                src={null}
                title={c.title}
                type={c.type}
                showTypeBadge={false}
              />
            </div>
          ))}
        </div>

        {/* Texte de promotion */}
        <div className="relative z-10 max-w-md">
          <div className="mb-8">
            <Logo size={40} />
          </div>
          {kicker && (
            <div
              className="text-[10px] uppercase tracking-[.24em] font-mono mb-4"
              style={{ color: "var(--text-dim)" }}
            >
              {kicker}
            </div>
          )}
          {title && (
            <h2 className="font-serif text-[44px] lg:text-[56px] leading-[0.95] text-white tracking-tight">
              {title}
            </h2>
          )}
          {body && (
            <p
              className="mt-5 text-[15px] leading-relaxed max-w-sm"
              style={{ color: "var(--text-dim)" }}
            >
              {body}
            </p>
          )}
        </div>
      </div>

      {/* Panneau formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[420px]">
          {/* Logo mobile only — affiché en haut du form sur petit écran */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size={36} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
