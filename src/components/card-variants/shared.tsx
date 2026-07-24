import { CARD_FORMAT } from "@/lib/card-format";
import { PAPER_TEXTURE, VARIANT_PALETTE } from "@/lib/card-variants";

export const P = VARIANT_PALETTE;

export function cardShell(scale: number): React.CSSProperties {
  const { trim, bleed } = CARD_FORMAT;
  return {
    width: `${(trim.width + bleed * 2) * scale}mm`,
    height: `${(trim.height + bleed * 2) * scale}mm`,
    padding: `${bleed * scale}mm`,
    position: "relative",
    background: "transparent",
  };
}

export function cardTrim(scale: number, bg: string = P.ivory): React.CSSProperties {
  const { trim, cornerRadius } = CARD_FORMAT;
  return {
    width: `${trim.width * scale}mm`,
    height: `${trim.height * scale}mm`,
    borderRadius: `${cornerRadius * scale}mm`,
    background: bg,
    backgroundImage: `${PAPER_TEXTURE}`,
    backgroundSize: `${60 * scale}mm ${60 * scale}mm`,
    boxShadow:
      "0 1px 0 rgba(52,45,39,0.04), 0 10px 24px -12px rgba(52,45,39,0.20), 0 30px 60px -30px rgba(52,45,39,0.25)",
    position: "relative",
    overflow: "hidden",
    color: P.ink,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  };
}

/** Small hand-drawn face-to-face illustration (two profiles + connecting arc). */
export function FaceToFaceIllustration({
  scale = 1,
  size = 18,
  stroke = P.ink,
  accent = P.clay,
}: {
  scale?: number;
  size?: number;
  stroke?: string;
  accent?: string;
}) {
  const s = size * scale;
  return (
    <svg
      viewBox="0 0 120 60"
      width={`${s}mm`}
      height={`${(s / 2)}mm`}
      fill="none"
      stroke={stroke}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Adult profile */}
      <path d="M18 52 C 14 42, 14 30, 20 22 C 26 14, 34 12, 40 16 C 44 19, 44 24, 42 27 C 40 30, 40 33, 42 35 C 44 37, 42 40, 40 41 C 38 42, 38 46, 40 48" />
      <circle cx="34" cy="22" r="0.9" fill={stroke} stroke="none" />
      {/* Baby profile — mirrored, a bit smaller */}
      <path d="M102 52 C 105 44, 105 34, 100 28 C 95 22, 88 21, 84 24 C 81 26, 81 30, 83 32 C 85 34, 85 36, 83 37 C 81 38, 82 41, 84 42" />
      <circle cx="88" cy="30" r="0.8" fill={stroke} stroke="none" />
      {/* Connecting arc — turn-taking */}
      <path d="M46 26 Q 60 12, 78 28" stroke={accent} strokeDasharray="0.6 2" />
      {/* Tiny sound dots */}
      <circle cx="60" cy="18" r="0.9" fill={accent} stroke="none" />
      <circle cx="66" cy="20" r="0.6" fill={accent} stroke="none" />
    </svg>
  );
}

/** Reusable organic blob path. */
export function Blob({
  d,
  fill,
  opacity = 1,
  className,
  style,
}: {
  d: string;
  fill: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      style={{ display: "block", ...style }}
      aria-hidden
    >
      <path d={d} fill={fill} opacity={opacity} />
    </svg>
  );
}
