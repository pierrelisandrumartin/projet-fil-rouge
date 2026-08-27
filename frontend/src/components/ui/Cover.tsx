interface CoverProps {
  src?: string | null;
  title: string;
  type?: string;
  className?: string;
  showTypeBadge?: boolean;
}

function Cover({
  src,
  title,
  type,
  className = "",
  showTypeBadge = true,
}: CoverProps) {
  const hue = hashHue(title);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: "inherit", aspectRatio: "2 / 3" }}
    >
      {src ? (
        <img
          src={src}
          alt={`${title} cover`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <ProceduralCover title={title} hue={hue} />
      )}

      {showTypeBadge && type && (
        <div
          className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[10px] uppercase font-mono"
          style={{
            background: "rgba(0,0,0,.5)",
            backdropFilter: "blur(6px)",
            color: "rgba(255,255,255,.85)",
            letterSpacing: ".1em",
          }}
        >
          {type}
        </div>
      )}
    </div>
  );
}

// Fallback SVG procédural pour les œuvres sans cover URL
function ProceduralCover({ title, hue }: { title: string; hue: number }) {
  const id = `cov-${title.replace(/\s+/g, "-").toLowerCase().slice(0, 20)}`;

  return (
    <svg
      viewBox="0 0 200 300"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 75% 38%)`} />
          <stop offset="55%" stopColor={`hsl(${(hue + 30) % 360} 60% 18%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 70) % 360} 50% 8%)`} />
        </linearGradient>
        <radialGradient id={`${id}-v`} cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <rect width="200" height="300" fill={`url(#${id})`} />
      <rect width="200" height="300" fill={`url(#${id}-v)`} />
      <text
        x="100"
        y="160"
        textAnchor="middle"
        fontFamily="'Instrument Serif', serif"
        fontSize="180"
        fill="white"
        fillOpacity="0.08"
        fontStyle="italic"
        fontWeight="400"
      >
        {title[0]}
      </text>
    </svg>
  );
}

// Hash simple : convertit un titre en valeur 0-359 pour la teinte
function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) % 360;
  }
  return h;
}

export default Cover;