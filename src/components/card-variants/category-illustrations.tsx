import { P } from "./shared";
import {
  FaceToFace,
  SoftKicks,
  ReachingObject,
  WordsWeSee,
  SingingMusic,
  LeafMoving,
  ChangingSong,
  CalmOnArm,
} from "./scenes-v2";
import type { VisualCategory } from "@/lib/visual-categories";

/**
 * V6 — CATEGORY ILLUSTRATIONS
 *
 * 10 faste micro-story scener — én pr. visual_category. Alle deler
 * style lock (streg, palette, negativt rum). Ingen kopi af scener på tværs.
 *
 * Bevarer læringen fra Micro Story-systemet:
 * — én tydelig relation eller handling
 * — 2–3 relevante elementer
 * — meget negativt rum
 * — diskret koralfarvet respons/bevægelse hvor relevant
 */

interface SceneProps { scale?: number }

const S = {
  fill: "none" as const,
  stroke: P.ink,
  strokeOpacity: 0.72,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const THIN = { ...S, strokeWidth: 1.1, strokeOpacity: 0.55 };
const VB = "0 0 300 180";
const svgStyle = { width: "100%", height: "100%", display: "block" as const };

/* SANSER & OPDAGELSE — babyfingre møder blødt lysfelt + små funklinger */
function SenseDiscovery(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <rect width="300" height="180" fill={P.mist} opacity="0.28" />
      {/* Blødt lysfelt / tekstur i højre halvdel */}
      <path
        d="M 150 42 Q 250 40 268 90 Q 258 148 172 152 Q 130 140 128 96 Q 132 58 150 42 Z"
        fill={P.butter} opacity="0.55"
      />
      <path
        d="M 156 60 Q 236 60 250 96 Q 240 138 176 140"
        {...THIN}
      />
      {/* Babys hånd/underarm venstre — fingre strækker sig ind i lysfeltet */}
      <path d="M 30 138 c 22 -6 46 -12 66 -20" {...S} />
      <path d="M 90 118 c 6 -2 12 -2 18 0 M 96 112 c 6 -2 12 -2 18 0 M 100 106 c 6 -2 12 -2 18 0 M 104 100 c 6 -2 12 -2 18 0" {...S} />
      {/* Små funklinger / responsmarkører */}
      <circle cx="180" cy="80" r="1.4" fill={P.clay} />
      <circle cx="200" cy="70" r="1.1" fill={P.clay} opacity="0.75" />
      <circle cx="216" cy="98" r="1" fill={P.clay} opacity="0.6" />
      <path d="M 172 92 q 8 -4 14 0" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.4" strokeLinecap="round" />
    </svg>
  );
}

/* LEG & UDFORSKNING — baby undersøger klods, voksens hånd tæt ved */
function PlayExplore(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <path d="M 10 132 Q 150 118 290 132 L 290 168 L 10 168 Z" fill={P.sage} opacity="0.5" />
      {/* Baby siddende profil, venstre */}
      <path d="M 70 154 C 62 130 62 102 78 90 C 92 80 108 84 112 96 C 114 104 110 112 104 116 C 100 118 100 122 104 124" {...S} />
      <circle cx="94" cy="102" r="1.3" fill={P.ink} opacity="0.75" />
      {/* Babys arme frem mod klods */}
      <path d="M 112 122 c 8 4 14 8 18 12 M 106 130 c 6 6 12 10 18 12" {...S} />
      {/* Klods 1 — stående */}
      <rect x="146" y="118" width="18" height="18" rx="1.5" fill={P.clay} opacity="0.8" />
      <rect x="146" y="118" width="18" height="18" rx="1.5" fill="none" stroke={P.ink} strokeOpacity="0.55" strokeWidth="1.2" />
      {/* Klods 2 — vippet, i færd med at falde */}
      <g transform="translate(180 118) rotate(18)">
        <rect x="0" y="0" width="18" height="18" rx="1.5" fill={P.butter} opacity="0.85" />
        <rect x="0" y="0" width="18" height="18" rx="1.5" fill="none" stroke={P.ink} strokeOpacity="0.55" strokeWidth="1.2" />
      </g>
      {/* Voksens hånd tæt ved — respons, ikke overtager */}
      <path d="M 236 132 c -8 -2 -16 0 -20 6 c -2 6 4 12 12 12 c 4 0 8 -2 12 -4" {...S} />
      {/* Lille bevægelseskurve mellem baby og klods */}
      <path d="M 128 130 q 10 -6 18 -4" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

export const CATEGORY_SCENES: Record<VisualCategory, React.FC<SceneProps>> = {
  naerhed_samspil: FaceToFace,
  krop_bevaegelse: SoftKicks,
  haender_nysgerrighed: ReachingObject,
  sanser_opdagelse: SenseDiscovery,
  sprog_samtale: WordsWeSee,
  musik_rytme: SingingMusic,
  natur_udeliv: LeafMoving,
  hverdagsstunder: ChangingSong,
  ro_tryghed: CalmOnArm,
  leg_udforskning: PlayExplore,
};

export function CategoryIllustration({
  category, scale,
}: { category: VisualCategory; scale?: number }) {
  const Scene = CATEGORY_SCENES[category];
  return <Scene scale={scale} />;
}
