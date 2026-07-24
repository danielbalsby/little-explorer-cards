import { P } from "./shared";

/**
 * V5 — RELATION REDESIGN
 *
 * Princip: brandmarket symboliserer voksen + barn + et lille svar mellem dem.
 * Ingen infinity. Ingen hjerter. Ingen babyclipart.
 * Bygget på DNA'et fra "Ansigt til ansigt" — reduceret kraftigt.
 */
export type RelationMarkVariant = "two_profiles" | "two_forms_response" | "connection_line";

export const RELATION_MARK_VARIANTS: Array<{
  id: RelationMarkVariant;
  name: string;
  description: string;
}> = [
  {
    id: "two_profiles",
    name: "R1 · Two Profiles",
    description: "To ultra-minimale profilkurver vendt mod hinanden. Ingen komplette ansigter.",
  },
  {
    id: "two_forms_response",
    name: "R2 · Two Forms + Response",
    description: "En større og en mindre organisk form, med et lille svar imellem.",
  },
  {
    id: "connection_line",
    name: "R3 · Connection Line",
    description: "To enkle former forbundet af en diskret punkteret kurve.",
  },
];

interface Props {
  variant?: RelationMarkVariant;
  size?: number;
  scale?: number;
  color?: string;
  accent?: string;
}

export function RelationMark({
  variant = "two_profiles",
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

  switch (variant) {
    case "two_profiles":
      return (
        <svg {...common}>
          {/* Venstre profil (voksen) — ultra minimal */}
          <path
            d="M 30 78 C 26 66 26 46 34 36 C 40 28 46 28 48 34 C 49 40 47 46 44 48 C 42 50 42 54 44 56 C 46 58 44 62 42 64"
            fill="none" stroke={color} strokeOpacity="0.85"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Højre profil (baby) — mindre, spejlet */}
          <path
            d="M 70 78 C 72 68 72 54 68 46 C 64 40 58 40 56 44 C 55 48 57 52 59 54 C 61 56 60 60 58 62"
            fill="none" stroke={color} strokeOpacity="0.85"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Lille svar mellem dem */}
          <circle cx="52" cy="42" r="1.6" fill={accent} />
        </svg>
      );
    case "two_forms_response":
      return (
        <svg {...common}>
          {/* Større form (voksen) */}
          <path
            d="M 18 62 C 14 44 26 30 40 34 C 52 38 50 60 40 66 C 30 70 22 68 18 62 Z"
            fill="none" stroke={color} strokeOpacity="0.85" strokeWidth="2.2" strokeLinejoin="round"
          />
          {/* Mindre form (baby) */}
          <path
            d="M 64 66 C 60 56 68 46 76 50 C 82 54 80 66 74 68 C 70 70 66 70 64 66 Z"
            fill="none" stroke={color} strokeOpacity="0.85" strokeWidth="2.2" strokeLinejoin="round"
          />
          {/* Svar imellem — lille kurve + prik */}
          <path d="M 46 52 Q 55 44 60 52" stroke={accent} strokeWidth="1.4"
            fill="none" strokeLinecap="round" strokeDasharray="0.8 2" />
          <circle cx="53" cy="46" r="1.4" fill={accent} />
        </svg>
      );
    case "connection_line":
    default:
      return (
        <svg {...common}>
          {/* Venstre form */}
          <path
            d="M 22 62 C 18 48 28 36 40 38 C 50 40 50 60 42 66 C 34 70 26 68 22 62 Z"
            fill="none" stroke={color} strokeOpacity="0.85" strokeWidth="2" strokeLinejoin="round"
          />
          {/* Højre form (mindre) */}
          <path
            d="M 68 66 C 62 56 70 46 78 50 C 84 54 82 66 76 68 C 72 70 70 70 68 66 Z"
            fill="none" stroke={color} strokeOpacity="0.85" strokeWidth="2" strokeLinejoin="round"
          />
          {/* Diskret punkteret kurve som forbindelse */}
          <path d="M 44 50 Q 55 34 68 52"
            stroke={accent} strokeWidth="1.2" fill="none"
            strokeLinecap="round" strokeDasharray="1 2.4" />
        </svg>
      );
  }
}
