import { P } from "./shared";

/**
 * V6.1 — R1 GOLD REFINEMENT (refined)
 *
 * Ændringer ift. V6:
 * - Baby-profil har nu reelle baby-proportioner (større pande, kortere hals, mindre hage).
 * - Stroke reduceret til 1.6 → matcher kategoriillustrationerne.
 * - Buen er solid som default (holder ved < 10 mm print). Stiplet variant separat.
 * - r1c_compact bruger et strammere viewBox — mærket fylder reelt mere ved samme kvadratformat.
 * - r1b har tydeligere åbning (kortere + højere respons + prik).
 */
export type R1Variant = "r1a_baseline" | "r1b_open_response" | "r1c_compact_favicon";

export const R1_VARIANTS: Array<{
  id: R1Variant;
  name: string;
  description: string;
}> = [
  {
    id: "r1a_baseline",
    name: "R1a · Baseline",
    description: "To profiler + solid koral responsbue. Tro mod Gold-scenen, minus alt andet.",
  },
  {
    id: "r1b_open_response",
    name: "R1b · Open Response",
    description: "Kortere åben bue + lille prik — føles mere som samtale end symbol.",
  },
  {
    id: "r1c_compact_favicon",
    name: "R1c · Compact",
    description: "Strammere viewBox. Profilerne fylder reelt mere ved 7 mm og favicon.",
  },
];

interface Props {
  variant?: R1Variant;
  size?: number;
  scale?: number;
  color?: string;
  accent?: string;
}

/**
 * Voksen profil (venstre) — samme som scene-pathen, skaleret ned.
 * Streg 1.6 matcher kategoriillustrationerne, så logo og illustration
 * kan stå ved siden af hinanden på bagsiden uden tykkelseskonflikt.
 */
const STROKE = {
  fill: "none" as const,
  strokeOpacity: 0.9,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Baby-profilen har nu reelle baby-proportioner:
 * — større, mere rund pande (buer mere ud øverst),
 * — kortere, mindre defineret hage,
 * — kortere hals inden krop begynder.
 */
function AdultProfile({ color }: { color: string }) {
  return (
    <path
      d="M 30 82 C 24 66 24 46 34 34 C 42 26 52 24 56 32 C 58 38 56 44 52 46 C 50 48 50 52 52 54 C 54 56 52 60 50 62"
      stroke={color} {...STROKE}
    />
  );
}

function BabyProfile({ color }: { color: string }) {
  // Højreprofil, mindre. Pande buer bredere ud (C 78 34 → 74 38), hage kortere,
  // hals hurtigere ned i krop. Læses som baby, ikke lille voksen.
  return (
    <path
      d="M 74 82 C 78 70 80 56 74 48 C 68 40 60 40 56 46 C 55 50 57 53 59 54 C 60 55 60 58 58 60"
      stroke={color} {...STROKE}
    />
  );
}

export function R1Mark({
  variant = "r1a_baseline",
  size = 22,
  scale = 1,
  color = P.ink,
  accent = P.clay,
}: Props) {
  const s = size * scale;
  const viewBox =
    variant === "r1c_compact_favicon" ? "20 24 60 62" : "0 0 100 100";

  const common = {
    width: `${s}mm`,
    height: `${s}mm`,
    viewBox,
    "aria-hidden": true as const,
    style: { display: "block" as const },
  };

  switch (variant) {
    case "r1a_baseline":
      return (
        <svg {...common}>
          <AdultProfile color={color} />
          <BabyProfile color={color} />
          {/* Solid responsbue — holder ved <10 mm print */}
          <path
            d="M 44 32 Q 55 16 66 34"
            stroke={accent} strokeWidth="1.6" fill="none"
            strokeLinecap="round"
          />
        </svg>
      );

    case "r1b_open_response":
      return (
        <svg {...common}>
          <AdultProfile color={color} />
          <BabyProfile color={color} />
          {/* Tydeligt åben, højere respons — samtale ikke bro */}
          <path
            d="M 46 30 Q 55 12 64 30"
            stroke={accent} strokeWidth="1.6" fill="none"
            strokeLinecap="round"
          />
          <circle cx="55" cy="14" r="1.8" fill={accent} />
        </svg>
      );

    case "r1c_compact_favicon":
    default:
      return (
        <svg {...common}>
          <AdultProfile color={color} />
          <BabyProfile color={color} />
          {/* Solid bue, tættere på profilerne. Cropet viewBox gør mærket 40 % større ved samme kvadrat */}
          <path
            d="M 44 32 Q 55 20 66 34"
            stroke={accent} strokeWidth="1.6" fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
