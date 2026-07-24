import { P } from "./shared";

export type BrandmarkVariant = "relation" | "moment" | "together" | "legacy_b";

export const BRANDMARK_VARIANTS: Array<{
  id: BrandmarkVariant;
  name: string;
  description: string;
}> = [
  { id: "relation", name: "Relation", description: "To små organiske former, der vender mod hinanden." },
  { id: "moment", name: "Moment", description: "En lille sol med en håndtegnet bevægelseskurve." },
  { id: "together", name: "Together", description: "To simple kurver, der næsten mødes." },
  { id: "legacy_b", name: "Legacy · b", description: "Det oprindelige kursiverede monogram." },
];

interface Props {
  variant?: BrandmarkVariant;
  size?: number;
  scale?: number;
  color?: string;
}

export function Brandmark({
  variant = "relation",
  size = 22,
  scale = 1,
  color = P.ink,
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
    case "relation":
      return (
        <svg {...common}>
          <path d="M 26 50 C 26 30 46 26 50 40 C 54 26 74 30 74 50 C 74 60 66 66 58 62 C 54 60 50 56 50 52 C 50 56 46 60 42 62 C 34 66 26 60 26 50 Z"
            fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "moment":
      return (
        <svg {...common}>
          <circle cx="42" cy="46" r="14" fill="none" stroke={color} strokeWidth="3.2" />
          <path d="M 28 68 Q 50 56 76 68" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case "together":
      return (
        <svg {...common}>
          <path d="M 22 62 Q 34 30 48 50" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 78 62 Q 66 30 52 50" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="50" cy="52" r="1.6" fill={color} />
        </svg>
      );
    case "legacy_b":
    default:
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1" />
          <text x="50" y="66" textAnchor="middle"
            fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontSize="54" fill={color}>b</text>
        </svg>
      );
  }
}
