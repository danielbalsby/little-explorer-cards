import { P } from "./shared";

/**
 * Kompositionsfamilier for forsideillustrationer.
 * Style lock (streg, palette, negativt rum) er fælles — komposition varierer.
 */
export type SceneFamily =
  | "face_scene"
  | "hands_scene"
  | "feet_scene"
  | "object_scene"
  | "nature_scene"
  | "room_scene"
  | "sound_scene"
  | "movement_scene"
  | "caregiver_baby_scene"
  | "abstract_sensory_scene";

interface SceneProps {
  scale?: number;
}

const commonStroke = {
  fill: "none" as const,
  stroke: P.ink,
  strokeOpacity: 0.72,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Ansigt til ansigt — bevaret som style reference. */
export function FaceScene(_: SceneProps) {
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      <path d="M 0 140 Q 150 120 300 140 L 300 180 L 0 180 Z" fill={P.sand} opacity="0.55" />
      <circle cx="150" cy="88" r="58" fill={P.butter} opacity="0.5" />
      <path d="M 90 150 C 82 130 82 105 92 90 C 102 74 122 70 132 82 C 138 90 138 100 134 106 C 130 112 130 118 134 122 C 138 126 134 132 130 134 C 126 136 128 144 132 148" {...commonStroke} />
      <circle cx="118" cy="94" r="1.6" fill={P.ink} opacity="0.75" />
      <path d="M 210 150 C 216 132 216 112 208 100 C 200 88 184 86 176 96 C 172 102 172 110 176 114 C 180 118 180 122 176 124 C 172 126 176 132 180 134" {...commonStroke} />
      <circle cx="188" cy="108" r="1.4" fill={P.ink} opacity="0.75" />
      <path d="M 140 82 Q 165 62 195 84" stroke={P.clay} strokeWidth="1.2" fill="none" strokeDasharray="1 3" strokeLinecap="round" />
      <circle cx="167" cy="70" r="1.6" fill={P.clay} />
    </svg>
  );
}

/** Fødder + åbne hænder — bevægelse, rytme. */
export function FeetScene(_: SceneProps) {
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      {/* Organisk gul/terracotta form */}
      <path d="M 30 100 C 60 60 240 60 270 110 C 260 140 40 150 30 100 Z" fill={P.butter} opacity="0.55" />
      {/* Babys små fødder */}
      <path d="M 120 118 c -6 -4 -6 -14 0 -18 c 6 -3 12 0 12 8 c 0 8 -6 12 -12 10 z" {...commonStroke} />
      <path d="M 118 100 c -1 -3 2 -5 4 -4 M 122 98 c 0 -2 2 -3 3 -2 M 126 98 c 0 -2 2 -3 3 -2" {...commonStroke} strokeWidth={1} />
      <path d="M 150 118 c -6 -4 -6 -14 0 -18 c 6 -3 12 0 12 8 c 0 8 -6 12 -12 10 z" {...commonStroke} />
      <path d="M 148 100 c -1 -3 2 -5 4 -4 M 152 98 c 0 -2 2 -3 3 -2 M 156 98 c 0 -2 2 -3 3 -2" {...commonStroke} strokeWidth={1} />
      {/* En voksens åbne hænder */}
      <path d="M 80 140 c -4 -10 -2 -20 6 -22 c 4 4 4 12 2 20" {...commonStroke} />
      <path d="M 220 140 c 4 -10 2 -20 -6 -22 c -4 4 -4 12 -2 20" {...commonStroke} />
      {/* Bevægelseslinjer */}
      <path d="M 90 80 q 8 -6 16 0 M 194 80 q 8 -6 16 0" stroke={P.clay} strokeWidth="1" fill="none" strokeLinecap="round" strokeOpacity="0.75" />
    </svg>
  );
}

/** Blad i vind + antydning af natur. */
export function LeafScene(_: SceneProps) {
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      <rect x="0" y="0" width="300" height="180" fill={P.mist} opacity="0.35" />
      {/* Vinduesramme antydning */}
      <path d="M 40 30 L 40 160 M 260 30 L 260 160 M 40 30 L 260 30" stroke={P.ink} strokeOpacity="0.18" strokeWidth="1" fill="none" />
      {/* Vindkurve */}
      <path d="M 60 120 Q 130 80 200 110 Q 250 130 270 100" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 3" strokeLinecap="round" opacity="0.8" />
      {/* Stort blad */}
      <g transform="translate(150 100) rotate(-18)">
        <path d="M 0 0 c 20 -30 60 -30 70 -6 c -10 26 -50 30 -70 6 z" fill={P.sage} opacity="0.9" />
        <path d="M 4 2 c 20 -22 50 -22 62 -4" {...commonStroke} strokeOpacity="0.35" strokeWidth="1" />
      </g>
      {/* Græsstrå nederst */}
      <path d="M 60 165 q 2 -12 6 -18 M 80 165 q -2 -14 4 -22 M 240 165 q 3 -10 -2 -20" {...commonStroke} strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

/** Vindue, lampe, silhuetter, små talebuer — fælles opmærksomhed. */
export function RoomWordScene(_: SceneProps) {
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      {/* Rum-baggrund */}
      <rect x="0" y="0" width="300" height="180" fill={P.ivory} />
      <path d="M 0 145 L 300 145" stroke={P.ink} strokeOpacity="0.15" strokeWidth="0.8" />
      {/* Vindue */}
      <rect x="40" y="40" width="70" height="80" fill={P.butter} opacity="0.45" />
      <path d="M 40 40 h 70 v 80 h -70 z M 75 40 v 80 M 40 80 h 70" stroke={P.ink} strokeOpacity="0.35" strokeWidth="1" fill="none" />
      {/* Lampe / plante — enkelt strå */}
      <path d="M 250 130 q -2 -22 4 -34 q 8 6 6 20" {...commonStroke} strokeWidth={1.2} strokeOpacity="0.55" />
      <ellipse cx="252" cy="140" rx="14" ry="4" fill={P.sand} opacity="0.7" />
      {/* Voksen silhuet */}
      <path d="M 150 145 c -4 -18 -4 -34 4 -44 c 8 -8 20 -6 22 4" {...commonStroke} />
      {/* Baby silhuet foran */}
      <path d="M 190 145 c -3 -12 -2 -22 4 -28 c 6 -6 14 -4 14 4" {...commonStroke} />
      {/* Små talebuer / prikker */}
      <circle cx="170" cy="80" r="1.6" fill={P.clay} />
      <circle cx="178" cy="76" r="1.2" fill={P.clay} opacity="0.75" />
      <path d="M 158 90 q 12 -8 24 -2" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Puslebord + små fødder + lydkurver + en voksen hånd. */
export function ChangingTableSongScene(_: SceneProps) {
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      {/* Puslepudeform */}
      <path d="M 40 130 Q 40 90 90 88 L 210 88 Q 260 90 260 130 L 260 150 Q 150 158 40 150 Z" fill={P.sand} opacity="0.6" />
      <path d="M 40 130 Q 40 90 90 88 L 210 88 Q 260 90 260 130" stroke={P.ink} strokeOpacity="0.3" strokeWidth="1" fill="none" />
      {/* Babys små fødder */}
      <path d="M 130 118 c -6 -4 -6 -14 0 -18 c 6 -3 12 0 12 8 c 0 8 -6 12 -12 10 z" {...commonStroke} />
      <path d="M 160 118 c -6 -4 -6 -14 0 -18 c 6 -3 12 0 12 8 c 0 8 -6 12 -12 10 z" {...commonStroke} />
      {/* En voksens hånd */}
      <path d="M 210 110 c 10 -6 22 -4 26 4 c -6 8 -20 10 -28 4 z" {...commonStroke} />
      {/* Lydkurver / noter */}
      <path d="M 60 60 q 8 -10 16 0 q 8 10 16 0" stroke={P.clay} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="98" cy="46" r="2" fill={P.clay} />
      <path d="M 100 46 L 100 34" stroke={P.clay} strokeWidth="1" />
      <path d="M 220 50 q 6 -8 12 0" stroke={P.clay} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export const SCENE_RENDERERS: Record<string, React.FC<SceneProps>> = {
  face: FaceScene,
  feet: FeetScene,
  leaf: LeafScene,
  room_word: RoomWordScene,
  changing_table_song: ChangingTableSongScene,
};

export type SceneKey = keyof typeof SCENE_RENDERERS;
