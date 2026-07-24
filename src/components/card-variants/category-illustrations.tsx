import { P } from "./shared";
import { FaceToFace, WordsWeSee, SingingMusic, CalmOnArm } from "./scenes-v2";
import { VISUAL_CATEGORY_META, type VisualCategory } from "@/lib/visual-categories";

/**
 * V6.1 — CATEGORY ILLUSTRATIONS (refined)
 *
 * Ændringer ift. V6:
 * - Signatur-scener pr. kategori, ikke bare eksempler fra ét kort.
 * - Floating blob-baggrund overalt (ingen fuld-rect fill) → papirvarmen bevares.
 * - Konsistent stroke 1.6 / opacity 0.72.
 * - Kategoriens accent-farve fra VISUAL_CATEGORY_META bruges som bagblobbens toning.
 * - natur_udeliv får en ægte udendørsscene (ikke indendørs blad).
 * - krop_bevaegelse / hverdagsstunder / leg_udforskning redesignet så de
 *   rummer flere kort i kategorien (ikke bare "puslebord" eller "klodser").
 *
 * Style lock er identisk med "Ansigt til ansigt" (Gold Standard).
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

/** Map from category accent token → concrete palette color. */
const ACCENT_FILL: Record<VisualCategory, string> = Object.fromEntries(
  Object.values(VISUAL_CATEGORY_META).map((m) => [m.id, P[m.accent]])
) as Record<VisualCategory, string>;

/** Floating blob helper — konsistent bagfelt for alle scener. */
function BackBlob({ fill, opacity = 0.5 }: { fill: string; opacity?: number }) {
  return (
    <path
      d="M 60 44 C 130 26 220 30 258 74 C 276 118 234 152 168 156 C 96 160 46 132 40 92 C 38 72 46 54 60 44 Z"
      fill={fill} opacity={opacity}
    />
  );
}

/* ============================================================
 * DEDICATED CATEGORY SCENES
 * ============================================================ */

/* SANSER & OPDAGELSE — babyfingre møder blødt lysfelt + funklinger */
function SenseDiscovery(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <BackBlob fill={ACCENT_FILL.sanser_opdagelse} opacity={0.42} />
      {/* Blødt lysfelt, mindre og floating */}
      <path
        d="M 168 60 Q 232 58 244 96 Q 234 138 174 140 Q 138 130 138 98 Q 142 72 168 60 Z"
        fill={P.butter} opacity="0.7"
      />
      {/* Babys hånd/underarm venstre — fingre strækker sig ind i lysfeltet */}
      <path d="M 48 138 c 22 -6 44 -12 62 -20" {...S} />
      <path d="M 104 120 c 6 -2 12 -2 18 0 M 108 114 c 6 -2 12 -2 16 0 M 112 108 c 6 -2 12 -2 16 0 M 116 102 c 6 -2 12 -2 14 0" {...S} />
      {/* Små funklinger — respons */}
      <circle cx="182" cy="82" r="1.4" fill={P.clay} />
      <circle cx="204" cy="76" r="1.1" fill={P.clay} opacity="0.75" />
      <circle cx="216" cy="104" r="1" fill={P.clay} opacity="0.6" />
      <path d="M 172 96 q 8 -4 14 0" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.4" strokeLinecap="round" />
    </svg>
  );
}

/* KROP & BEVÆGELSE — baby i luften, voksens hænder løfter/støtter
   (rummer bløde spark, maveliggende leg, rul, løft — ikke kun én af dem) */
function BodyMovement(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <BackBlob fill={ACCENT_FILL.krop_bevaegelse} opacity={0.5} />
      {/* Voksens to hænder nedefra — enkle */}
      <path d="M 88 148 c -8 -4 -10 -14 -2 -20 c 8 -4 18 0 22 8" {...S} />
      <path d="M 212 148 c 8 -4 10 -14 2 -20 c -8 -4 -18 0 -22 8" {...S} />
      {/* Baby set fra siden, båret op — enkel silhuet: hoved + krop */}
      <circle cx="150" cy="82" r="14" {...S} />
      <path d="M 138 96 c -6 8 -6 22 0 30 c 6 6 18 6 24 0 c 6 -8 6 -22 0 -30" {...S} />
      {/* Små ben der sparker */}
      <path d="M 142 126 c -2 8 -4 14 -8 18 M 158 126 c 2 8 4 14 8 18" {...S} />
      {/* Bevægelseskurver — svar mellem hænder og krop */}
      <path d="M 112 132 q 12 -4 22 0" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.5" strokeLinecap="round" opacity="0.85" />
      <path d="M 166 132 q 12 -4 22 0" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/* HÆNDER & NYSGERRIGHED — én babyhånd rækker mod ét roligt objekt */
function HandsCuriosity(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <BackBlob fill={ACCENT_FILL.haender_nysgerrighed} opacity={0.42} />
      {/* Babys arm strækker sig ind fra venstre */}
      <path d="M 30 134 c 30 -8 58 -14 82 -12" {...S} />
      {/* Babyhånd — enkel */}
      <path d="M 112 122 c 6 -4 14 -4 18 0 c 2 4 -2 8 -6 8 c -4 0 -12 -2 -12 -8 z" {...S} />
      <path d="M 118 118 c 0 -3 0 -6 2 -8 M 124 118 c 0 -4 1 -8 3 -10 M 130 122 c 2 -2 4 -4 6 -4" {...THIN} />
      {/* Objekt — ét roligt, midtvejs */}
      <circle cx="190" cy="122" r="10" fill={P.clay} opacity="0.85" />
      <circle cx="190" cy="122" r="10" fill="none" stroke={P.ink} strokeOpacity="0.5" strokeWidth="1.2" />
      {/* Bevægelseskurve mellem hånd og objekt */}
      <path d="M 140 122 Q 165 112 180 118" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.4" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/* NATUR & UDELIV — ægte udendørsscene: horisont, træ, lille figur, vind */
function OutdoorNature(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <BackBlob fill={ACCENT_FILL.natur_udeliv} opacity={0.55} />
      {/* Horisont — blødt græsfelt */}
      <path d="M 0 138 Q 150 128 300 138 L 300 180 L 0 180 Z" fill={P.sage} opacity="0.7" />
      {/* Træ, højre — enkelt */}
      <path d="M 232 138 L 232 92" stroke={P.ink} strokeOpacity="0.6" strokeWidth="1.4" />
      <circle cx="232" cy="80" r="20" fill={P.sage} opacity="0.9" />
      <circle cx="232" cy="80" r="20" fill="none" stroke={P.ink} strokeOpacity="0.35" strokeWidth="1" />
      {/* Voksen med baby på arm — silhuet, venstre */}
      <path d="M 88 156 C 80 128 82 96 94 84 C 106 74 122 78 126 90 C 128 100 124 112 118 116" {...S} />
      {/* Baby på arm */}
      <path d="M 118 116 c 8 -2 18 4 22 12" {...S} />
      <path d="M 120 100 c 0 -8 12 -10 18 -4 c 4 4 2 12 -4 14 c -6 2 -14 -2 -14 -10 z" {...S} />
      {/* Vindkurve — svar i naturen */}
      <path d="M 40 66 Q 130 52 210 70" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 3" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/* HVERDAGSSTUNDER — voksens hænder + baby i overgang (bad/skift/mad),
   ikke bundet til puslebord. Fokus: hænder + baby + rolig kontekstlinje. */
function EverydayMoments(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <BackBlob fill={ACCENT_FILL.hverdagsstunder} opacity={0.55} />
      {/* Rolig fladelinje — antyder puslebord/bad/mad uden at fastlåse */}
      <path d="M 40 128 Q 150 122 260 128" stroke={P.ink} strokeOpacity="0.28" strokeWidth="1" fill="none" />
      <path d="M 40 138 Q 150 132 260 138" stroke={P.ink} strokeOpacity="0.16" strokeWidth="0.9" fill="none" />
      {/* Baby liggende, meget enkel — hoved + krop */}
      <circle cx="132" cy="106" r="12" {...S} />
      <path d="M 122 118 c -4 6 -4 16 2 20 c 8 4 20 4 28 0 c 6 -4 6 -14 2 -20" {...S} />
      {/* To voksne hænder — én ved hoved, én ved krop */}
      <path d="M 96 112 c -8 -2 -14 2 -14 10 c 0 6 6 10 14 8 c 4 -1 8 -4 12 -4" {...S} />
      <path d="M 190 128 c 10 -2 20 2 24 10 c 2 6 -4 12 -12 10 c -6 -1 -12 -4 -18 -4" {...S} />
      {/* Lille lyd/tone — enkel, mangetydig (nynnen, tale, vand) */}
      <path d="M 70 62 q 8 -12 16 0 q 8 12 16 0" stroke={P.clay} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* LEG & UDFORSKNING — baby siddende, ét objekt i midten, voksens tilstedeværelse
   antydes som skygge/silhuet. Rummer klodser, skjul-og-find, tårn m.m. */
function PlayExplore(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <BackBlob fill={ACCENT_FILL.leg_udforskning} opacity={0.5} />
      {/* Gulvlinje — meget diskret */}
      <path d="M 20 148 Q 150 140 280 148" stroke={P.ink} strokeOpacity="0.2" strokeWidth="1" fill="none" />
      {/* Baby siddende profil, venstre */}
      <path d="M 76 148 C 68 124 68 100 84 88 C 98 78 114 82 118 94 C 120 102 116 110 110 114 C 106 116 106 120 110 122" {...S} />
      <circle cx="100" cy="100" r="1.3" fill={P.ink} opacity="0.75" />
      {/* Babys arm frem mod objekt */}
      <path d="M 118 120 c 10 4 18 6 26 6" {...S} />
      {/* Ét roligt objekt — kvadrat, midten */}
      <rect x="158" y="118" width="20" height="20" rx="2" fill={P.clay} opacity="0.85" />
      <rect x="158" y="118" width="20" height="20" rx="2" fill="none" stroke={P.ink} strokeOpacity="0.55" strokeWidth="1.2" />
      {/* Voksens tilstedeværelse — silhuetantydning højre, ikke aktiv aktør */}
      <path d="M 232 148 C 226 128 228 106 238 96 C 246 90 254 92 256 100" {...THIN} />
      {/* Bevægelseskurve — respons mellem baby og objekt */}
      <path d="M 138 128 q 10 -6 18 -6" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/* SPROG & SAMTALE — brug WordsWeSee men lettere refit via wrapper for konsistens */
/* NÆRHED, MUSIK, RO — FaceToFace / SingingMusic / CalmOnArm bevares (fungerer). */

export const CATEGORY_SCENES: Record<VisualCategory, React.FC<SceneProps>> = {
  naerhed_samspil: FaceToFace,          // Gold reference — uændret
  krop_bevaegelse: BodyMovement,        // NY signatur
  haender_nysgerrighed: HandsCuriosity, // NY signatur
  sanser_opdagelse: SenseDiscovery,     // Refined blob
  sprog_samtale: WordsWeSee,            // Bevares
  musik_rytme: SingingMusic,            // Bevares
  natur_udeliv: OutdoorNature,          // NY — ægte udendørs (fix mismatch)
  hverdagsstunder: EverydayMoments,     // NY signatur
  ro_tryghed: CalmOnArm,                // Bevares
  leg_udforskning: PlayExplore,         // Refined — mere negativt rum
};

export function CategoryIllustration({
  category, scale,
}: { category: VisualCategory; scale?: number }) {
  const Scene = CATEGORY_SCENES[category];
  return <Scene scale={scale} />;
}
