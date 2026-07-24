import { P } from "./shared";

/**
 * V6 — R1 GOLD REFINEMENT
 *
 * DNA fra "Ansigt til ansigt": stor + lille profil, vendt mod hinanden,
 * varm håndtegnet streg, lille koralfarvet punkteret responsbue mellem dem.
 * Fjernet: gul solcirkel, sandfarvet horisont, baggrund, øvrig scene.
 *
 * Kun 3 refinements af DETTE koncept — ingen nye logo-koncepter.
 * Skal fungere ved 7 mm og op til stor æskeforside.
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
    description: "To profiler + koral punkteret responsbue. Tro mod Gold-scenen, minus alt andet.",
  },
  {
    id: "r1b_open_response",
    name: "R1b · Open Response",
    description: "Samme profiler, buen er lidt kortere og åbner sig — føles mere som samtale end symbol.",
  },
  {
    id: "r1c_compact_favicon",
    name: "R1c · Compact",
    description: "Profilerne tættere sammen. Optimeret til 7 mm, favicon og æskehjørne.",
  },
];

interface Props {
  variant?: R1Variant;
  size?: number;
  scale?: number;
  color?: string;
  accent?: string;
}

export function R1Mark({
  variant = "r1a_baseline",
  size = 22,
  scale = 1,
  color = P.ink,
  accent = P.clay,
}: Props) {
  const s = size * scale;
  const common = {
    width: `${s}mm`,
    height: `${s}mm`,
    viewBox: "0 0 100 100",
    "aria-hidden": true as const,
    style: { display: "block" as const },
  };

  /**
   * Delt profilpar: voksen (venstre, større) + baby (højre, mindre).
   * Kurverne er direkte skaleret fra `FaceToFace` scene-pathen.
   */
  const strokeCommon = {
    fill: "none",
    stroke: color,
    strokeOpacity: 0.9,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (variant) {
    case "r1a_baseline":
      return (
        <svg {...common}>
          {/* Voksen profil venstre */}
          <path
            d="M 30 82 C 24 66 24 46 34 34 C 42 26 52 24 56 32 C 58 38 56 44 52 46 C 50 48 50 52 52 54 C 54 56 52 60 50 62"
            {...strokeCommon}
          />
          {/* Baby profil højre, mindre og spejlet */}
          <path
            d="M 72 82 C 76 68 76 52 70 44 C 64 38 56 38 54 44 C 53 48 55 52 57 54 C 59 56 58 60 56 62"
            {...strokeCommon}
          />
          {/* Koral punkteret responsbue */}
          <path
            d="M 44 32 Q 55 16 66 34"
            stroke={accent} strokeWidth="1.6" fill="none"
            strokeLinecap="round" strokeDasharray="1 2.6"
          />
        </svg>
      );

    case "r1b_open_response":
      return (
        <svg {...common}>
          <path
            d="M 30 82 C 24 66 24 46 34 34 C 42 26 52 24 56 32 C 58 38 56 44 52 46 C 50 48 50 52 52 54 C 54 56 52 60 50 62"
            {...strokeCommon}
          />
          <path
            d="M 72 82 C 76 68 76 52 70 44 C 64 38 56 38 54 44 C 53 48 55 52 57 54 C 59 56 58 60 56 62"
            {...strokeCommon}
          />
          {/* Åben respons — kortere bue + en lille prik der antyder svaret */}
          <path
            d="M 48 30 Q 55 22 62 30"
            stroke={accent} strokeWidth="1.6" fill="none"
            strokeLinecap="round" strokeDasharray="1 2.4"
          />
          <circle cx="55" cy="22" r="1.6" fill={accent} />
        </svg>
      );

    case "r1c_compact_favicon":
    default:
      return (
        <svg {...common}>
          {/* Profilerne rykket 4 enheder tættere for at fungere ved 7 mm */}
          <path
            d="M 34 82 C 28 66 28 46 38 34 C 46 26 54 24 58 32 C 60 38 58 44 54 46 C 52 48 52 52 54 54 C 56 56 54 60 52 62"
            {...strokeCommon}
          />
          <path
            d="M 68 82 C 72 68 72 52 66 44 C 60 38 54 38 52 44 C 51 48 53 52 55 54 C 57 56 56 60 54 62"
            {...strokeCommon}
          />
          {/* Kompakt bue, tættere på profilerne */}
          <path
            d="M 46 34 Q 53 24 62 34"
            stroke={accent} strokeWidth="1.6" fill="none"
            strokeLinecap="round" strokeDasharray="0.8 2.2"
          />
        </svg>
      );
  }
}
