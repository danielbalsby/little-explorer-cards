import { AGE_TOKEN, type AgeGroup } from "@/lib/card-schema";

/** Elegant håndtegnet SVG placeholder — organiske former i palettens farver. */
export function IllustrationPlaceholder({
  age_group,
  seed = 0,
}: {
  age_group: AgeGroup;
  seed?: number;
}) {
  const token = AGE_TOKEN[age_group];
  // Deterministiske "tilfældige" positioner ud fra seed så samme kort får samme placeholder
  const r = (n: number) => {
    const x = Math.sin(seed * 999 + n * 17) * 10000;
    return x - Math.floor(x);
  };
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id={`bg-${seed}`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor={`var(--color-${token})`} stopOpacity="0.55" />
          <stop offset="100%" stopColor={`var(--color-${token})`} stopOpacity="0.15" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#bg-${seed})`} />

      {/* Organisk stor form */}
      <ellipse
        cx={100 + r(1) * 20 - 10}
        cy={120 + r(2) * 20 - 10}
        rx={62}
        ry={55}
        fill="var(--color-sand)"
        opacity="0.55"
      />
      {/* Sekundær form */}
      <ellipse
        cx={80 + r(3) * 30}
        cy={95 + r(4) * 40}
        rx={30}
        ry={26}
        fill="var(--color-sage)"
        opacity="0.5"
      />
      {/* Lille måne / bue */}
      <path
        d={`M ${140 + r(5) * 10} ${70 + r(6) * 20} q 14 -6 22 6 q -10 2 -22 -6 z`}
        fill="var(--color-butter)"
        opacity="0.85"
      />
      {/* Små prikker som stjerner / detaljer */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={20 + r(10 + i) * 160}
          cy={20 + r(20 + i) * 200}
          r={1.4 + r(30 + i) * 1.6}
          fill="var(--color-foreground)"
          opacity="0.18"
        />
      ))}
      {/* Blødt håndtegnet strøg */}
      <path
        d="M 30 200 q 40 -20 80 -10 q 40 10 60 -6"
        fill="none"
        stroke="var(--color-foreground)"
        strokeOpacity="0.18"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
