import { P } from "./shared";

/**
 * V5 — MICRO STORY ILLUSTRATIONS
 *
 * Filosofi: illustrationen viser ikke et symbol for aktiviteten,
 * men et lille øjeblik FRA aktiviteten. Minimum 2–3 relevante
 * elementer (baby / voksen / hænder / fødder / objekt / omgivelse /
 * bevægelseslinje / lydlinje / blikretning) — kontekst, ikke kompleksitet.
 *
 * Style lock er identisk med "Ansigt til ansigt" (Gold Standard):
 * ét blødt farvefelt bagved, håndtegnet streg ~1.6 i P.ink@72%,
 * meget negativt rum, én støvet accentfarve.
 */

export type MicroStoryKey =
  | "face_to_face"        // Gold Standard reference
  | "soft_kicks"
  | "leaf_moving"
  | "words_we_see"
  | "changing_song"
  | "bath_time"
  | "tummy_play"
  | "reaching_object"
  | "singing_music"
  | "book_language"
  | "outdoor_walk"
  | "calm_on_arm";

export interface MicroStoryMeta {
  id: MicroStoryKey;
  title: string;
  composition:
    | "close_relationship"
    | "top_down_moment"
    | "side_profile_moment"
    | "object_and_baby"
    | "caregiver_hands_and_baby"
    | "room_environment"
    | "outdoor_environment"
    | "movement_crop"
    | "sound_music_scene"
    | "quiet_observation";
  brief: string;
  elements: string[];
  is_gold?: boolean;
}

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

/* 1 — ANSIGT TIL ANSIGT · Gold Standard reference (bevaret) */
export function FaceToFace(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <path d="M 0 140 Q 150 120 300 140 L 300 180 L 0 180 Z" fill={P.sand} opacity="0.55" />
      <circle cx="150" cy="88" r="58" fill={P.butter} opacity="0.5" />
      {/* Voksen profil, venstre */}
      <path d="M 90 152 C 82 130 82 104 92 88 C 102 72 122 68 132 80 C 138 88 138 100 134 106 C 130 112 130 118 134 122 C 138 126 134 132 130 134 C 126 136 128 144 132 150" {...S} />
      <circle cx="118" cy="94" r="1.6" fill={P.ink} opacity="0.75" />
      {/* Baby profil, højre */}
      <path d="M 210 152 C 216 132 216 112 208 100 C 200 88 184 86 176 96 C 172 102 172 110 176 114 C 180 118 180 122 176 124 C 172 126 176 132 180 134" {...S} />
      <circle cx="188" cy="108" r="1.4" fill={P.ink} opacity="0.75" />
      {/* Turtagningsbue + små lydprikker */}
      <path d="M 140 82 Q 165 62 195 84" stroke={P.clay} strokeWidth="1.2" fill="none" strokeDasharray="1 3" strokeLinecap="round" />
      <circle cx="167" cy="70" r="1.6" fill={P.clay} />
    </svg>
  );
}

/* 2 — BLØDE SPARK · top-down moment (baby underkrop + to voksne hænder) */
export function SoftKicks(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <path d="M 20 100 C 60 60 240 60 280 108 C 260 148 40 152 20 100 Z" fill={P.butter} opacity="0.5" />
      {/* Babys underkrop set fra oven — enkel silhuet */}
      <path d="M 130 82 C 130 74 170 74 170 82 L 168 118 C 168 128 158 132 150 132 C 142 132 132 128 132 118 Z" {...S} />
      {/* To små ben/fødder */}
      <path d="M 140 128 c 0 10 -2 20 -6 26 M 146 132 c 0 4 -1 8 -3 12" {...S} />
      <path d="M 160 128 c 0 10 2 20 6 26 M 154 132 c 0 4 1 8 3 12" {...S} />
      {/* To voksne hænder der møder fodsålerne */}
      <path d="M 108 158 c -6 -4 -8 -14 -2 -20 c 6 -4 14 -2 18 4 c 3 4 6 8 10 10" {...S} />
      <path d="M 192 158 c 6 -4 8 -14 2 -20 c -6 -4 -14 -2 -18 4 c -3 4 -6 8 -10 10" {...S} />
      {/* Bevægelseskurver — svar */}
      <path d="M 118 148 q 8 -6 16 -2 M 182 148 q -8 -6 -16 -2" stroke={P.clay} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/* 3 — BLADET DER BEVÆGER SIG · outdoor, babyprofil nederst + stort blad */
export function LeafMoving(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <rect width="300" height="180" fill={P.mist} opacity="0.32" />
      {/* Vindueskarm antydning */}
      <path d="M 22 32 L 22 150 M 278 32 L 278 150" {...THIN} />
      {/* Vindkurve */}
      <path d="M 40 108 Q 130 70 220 100 Q 260 118 280 96" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 3" strokeLinecap="round" opacity="0.85" />
      {/* Blad */}
      <g transform="translate(160 88) rotate(-20)">
        <path d="M 0 0 c 22 -32 66 -32 76 -6 c -10 28 -54 32 -76 6 z" fill={P.sage} opacity="0.9" />
        <path d="M 4 2 c 22 -24 54 -24 66 -4" {...THIN} />
      </g>
      {/* Babyprofil nederst — kigger op */}
      <path d="M 70 168 C 66 150 68 132 78 122 C 88 114 100 116 104 124 C 106 128 104 132 100 132 C 98 132 98 136 100 138" {...S} />
      <circle cx="92" cy="130" r="1.4" fill={P.ink} opacity="0.75" />
      {/* Græsstrå */}
      <path d="M 30 172 q 2 -10 6 -16 M 240 172 q -2 -12 4 -20" {...THIN} />
    </svg>
  );
}

/* 4 — ORD FOR DET VI SER · voksen + baby set bagfra mod vindue */
export function WordsWeSee(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <rect width="300" height="180" fill={P.ivory} />
      {/* Vindue */}
      <rect x="60" y="30" width="120" height="90" fill={P.butter} opacity="0.45" />
      <path d="M 60 30 h 120 v 90 h -120 z M 120 30 v 90 M 60 75 h 120" stroke={P.ink} strokeOpacity="0.32" strokeWidth="1" fill="none" />
      {/* Ét genkendeligt objekt udenfor (fugl på gren) */}
      <path d="M 130 60 q 20 -4 34 4" {...THIN} />
      <path d="M 138 58 c 2 -4 8 -4 10 0 c 0 4 -4 6 -8 4 z" fill={P.clay} opacity="0.75" />
      {/* Voksen bagfra */}
      <path d="M 210 150 C 202 128 204 96 218 84 C 232 74 246 78 250 88 C 252 96 250 108 244 112" {...S} />
      {/* Baby på arm foran voksen */}
      <path d="M 226 132 C 222 122 224 108 232 102 C 240 98 246 102 246 108 C 244 116 242 122 240 128" {...S} />
      {/* Diskret talemarke */}
      <circle cx="196" cy="58" r="1.6" fill={P.clay} />
      <circle cx="188" cy="62" r="1.1" fill={P.clay} opacity="0.75" />
      <path d="M 182 68 q 12 -6 22 -2" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.5" strokeLinecap="round" />
      <path d="M 0 158 L 300 158" stroke={P.ink} strokeOpacity="0.15" strokeWidth="0.8" />
    </svg>
  );
}

/* 5 — PUSLEBORDETS SANG · sound_music_scene */
export function ChangingSong(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      {/* Puslepudens form */}
      <path d="M 34 128 Q 34 88 84 86 L 216 86 Q 266 88 266 128 L 266 148 Q 150 156 34 148 Z" fill={P.sand} opacity="0.6" />
      <path d="M 34 128 Q 34 88 84 86 L 216 86 Q 266 88 266 128" stroke={P.ink} strokeOpacity="0.3" strokeWidth="1" fill="none" />
      {/* Baby — meget enkel silhuet, arme udbredt */}
      <path d="M 138 96 c 0 -8 24 -8 24 0 c 0 6 -4 10 -12 10 c -8 0 -12 -4 -12 -10 z" {...S} />
      <path d="M 138 108 C 130 108 122 112 118 118 M 162 108 c 8 0 16 4 20 10" {...S} />
      <path d="M 132 118 C 128 130 130 140 138 148 M 168 118 c 4 12 2 22 -6 30" {...S} />
      {/* Voksens hånd fra højre */}
      <path d="M 214 108 c 10 -6 22 -4 26 4 c -6 8 -20 10 -28 4 z" {...S} />
      {/* Lydkurver */}
      <path d="M 54 56 q 8 -12 16 0 q 8 12 16 0" stroke={P.clay} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="94" cy="42" r="2" fill={P.clay} />
      <path d="M 96 42 L 96 30" stroke={P.clay} strokeWidth="1" />
      <path d="M 224 48 q 6 -8 12 0" stroke={P.clay} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 6 — BADESTUND · caregiver hands + baby + vand */
export function BathTime(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <rect width="300" height="180" fill={P.mist} opacity="0.28" />
      {/* Kar */}
      <path d="M 40 100 Q 40 84 60 84 L 240 84 Q 260 84 260 100 L 254 140 Q 250 150 236 150 L 64 150 Q 50 150 46 140 Z"
        fill={P.ivory} stroke={P.ink} strokeOpacity="0.35" strokeWidth="1.2" />
      {/* Vandlinje */}
      <path d="M 52 120 Q 90 116 130 120 T 250 120" stroke={P.mist} strokeWidth="1.2" fill="none" opacity="0.9" />
      <path d="M 60 128 Q 110 124 160 128 T 248 128" stroke={P.mist} strokeWidth="0.9" fill="none" opacity="0.7" />
      {/* Baby — hovedet over vand */}
      <path d="M 140 96 c 0 -10 24 -10 24 0 c 0 8 -6 12 -12 12 c -6 0 -12 -4 -12 -12 z" {...S} />
      <circle cx="148" cy="98" r="0.9" fill={P.ink} opacity="0.75" />
      <circle cx="156" cy="98" r="0.9" fill={P.ink} opacity="0.75" />
      {/* Voksne hænder støtter under nakke og ryg */}
      <path d="M 116 112 c -8 -2 -14 2 -14 10 c 0 6 6 10 14 8 c 6 -2 10 -6 14 -6" {...S} />
      <path d="M 188 116 c 8 0 14 6 14 12 c 0 6 -6 8 -14 6" {...S} />
      {/* Små pletter — plask */}
      <circle cx="80" cy="90" r="1.2" fill={P.clay} opacity="0.75" />
      <circle cx="86" cy="82" r="0.9" fill={P.clay} opacity="0.6" />
      <circle cx="224" cy="88" r="1" fill={P.clay} opacity="0.7" />
    </svg>
  );
}

/* 7 — MAVELIGGENDE LEG · side profile, voksen ansigt tæt på babys niveau */
export function TummyPlay(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      {/* Gulvtæppe */}
      <path d="M 10 132 Q 150 116 290 132 L 290 168 L 10 168 Z" fill={P.sand} opacity="0.5" />
      {/* Baby mave-liggende, venstre */}
      <path d="M 60 138 c 20 -14 60 -14 80 -2 c -4 6 -14 8 -22 8 c -20 2 -50 -2 -58 -6 z" {...S} />
      {/* Babys hoved løftet */}
      <path d="M 58 124 c -4 -8 2 -16 12 -16 c 8 0 12 6 10 12 c -2 4 -4 6 -8 6" {...S} />
      <circle cx="66" cy="118" r="1.2" fill={P.ink} opacity="0.75" />
      {/* Babys arme støtter */}
      <path d="M 82 138 c -2 -6 0 -10 4 -12 M 100 138 c -2 -6 0 -10 4 -12" {...S} />
      {/* Voksen ansigt i babys øjenhøjde, højre */}
      <path d="M 240 130 C 244 116 232 100 216 104 C 202 108 200 122 206 128 C 210 132 214 132 218 130" {...S} />
      <circle cx="218" cy="118" r="1.4" fill={P.ink} opacity="0.75" />
      {/* Blikretning — diskret linje */}
      <path d="M 76 118 Q 150 96 210 116" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 3" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/* 8 — GRIBE EFTER GENSTAND · object_and_baby */
export function ReachingObject(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <circle cx="200" cy="88" r="52" fill={P.butter} opacity="0.5" />
      {/* Baby — halvfigur, venstre */}
      <path d="M 70 158 C 62 130 62 108 76 96 C 90 84 108 88 114 100 C 116 106 114 114 108 118 C 104 122 104 128 108 132" {...S} />
      <circle cx="98" cy="106" r="1.4" fill={P.ink} opacity="0.75" />
      {/* Babys arm strakt frem */}
      <path d="M 116 116 c 12 -2 22 0 30 6" {...S} />
      {/* Voksens hånd holder rangle */}
      <path d="M 220 118 c 10 -6 22 -4 28 4 c -6 8 -20 8 -28 2" {...S} />
      {/* Rangle — enkel form */}
      <circle cx="188" cy="112" r="6" fill={P.clay} opacity="0.85" />
      <path d="M 188 118 L 188 132" stroke={P.ink} strokeOpacity="0.6" strokeWidth="1.2" />
      {/* Bevægelseskurve mellem hånd og objekt */}
      <path d="M 150 120 Q 170 108 184 112" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.5" opacity="0.85" strokeLinecap="round" />
    </svg>
  );
}

/* 9 — SANG / MUSIK · voksen holder baby, lydkurver */
export function SingingMusic(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <path d="M 40 40 Q 150 20 260 40 L 260 60 Q 150 44 40 60 Z" fill={P.mist} opacity="0.35" />
      {/* Voksen siddende profil, holder baby på skødet */}
      <path d="M 110 158 C 102 130 102 100 116 84 C 130 70 152 74 158 88 C 162 100 158 114 150 118 C 146 120 146 124 150 128" {...S} />
      {/* Babys hoved mod voksens bryst */}
      <path d="M 172 118 c 0 -10 14 -14 22 -8 c 6 6 4 16 -4 20 c -8 4 -18 -2 -18 -12 z" {...S} />
      <circle cx="180" cy="116" r="1.2" fill={P.ink} opacity="0.75" />
      {/* Voksens arm om baby */}
      <path d="M 160 128 c 12 0 24 4 30 12" {...S} />
      {/* Lydkurver + note */}
      <path d="M 60 88 q 8 -12 16 0 q 8 12 16 0" stroke={P.clay} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="104" cy="74" r="2" fill={P.clay} />
      <path d="M 106 74 L 106 60" stroke={P.clay} strokeWidth="1" />
      <path d="M 230 96 q 6 -8 12 0" stroke={P.clay} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 10 — BOG / SPROG · voksen + baby med åben bog */
export function BookLanguage(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <path d="M 10 130 Q 150 118 290 130 L 290 168 L 10 168 Z" fill={P.sand} opacity="0.5" />
      {/* Voksen siddende, venstre */}
      <path d="M 60 150 C 52 122 56 96 72 82 C 88 70 108 76 112 90 C 114 100 110 110 104 114" {...S} />
      {/* Baby på skødet, midt */}
      <path d="M 128 138 c 0 -14 26 -14 26 0 c 0 8 -6 12 -14 12 c -6 0 -12 -4 -12 -12 z" {...S} />
      <circle cx="138" cy="130" r="1" fill={P.ink} opacity="0.75" />
      {/* Åben bog i forgrunden */}
      <path d="M 150 148 L 210 148 L 214 132 L 154 132 Z M 182 148 L 182 132" fill={P.ivory} stroke={P.ink} strokeOpacity="0.55" strokeWidth="1.2" />
      {/* Diskret bogtegning */}
      <path d="M 160 138 h 16 M 190 138 h 18" stroke={P.ink} strokeOpacity="0.35" strokeWidth="0.8" />
      {/* Voksens finger peger på bogen */}
      <path d="M 118 132 c 12 -2 22 0 32 4" {...S} />
      {/* Talemarke */}
      <circle cx="112" cy="66" r="1.3" fill={P.clay} />
      <path d="M 96 78 q 12 -6 22 -2" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 2.5" strokeLinecap="round" />
    </svg>
  );
}

/* 11 — UDENDØRS GÅTUR · outdoor_environment, klapvogn + voksen + træer */
export function OutdoorWalk(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      {/* Himmel + horisont */}
      <rect width="300" height="180" fill={P.mist} opacity="0.22" />
      <path d="M 0 138 Q 150 128 300 138 L 300 180 L 0 180 Z" fill={P.sage} opacity="0.55" />
      {/* Sti */}
      <path d="M 60 176 Q 150 150 260 176" stroke={P.sand} strokeWidth="10" fill="none" opacity="0.75" strokeLinecap="round" />
      {/* Træ, venstre */}
      <path d="M 40 138 L 40 92" stroke={P.ink} strokeOpacity="0.55" strokeWidth="1.4" />
      <circle cx="40" cy="80" r="18" fill={P.sage} opacity="0.85" />
      {/* Træ, højre */}
      <path d="M 262 138 L 262 100" stroke={P.ink} strokeOpacity="0.55" strokeWidth="1.4" />
      <circle cx="262" cy="90" r="14" fill={P.sage} opacity="0.8" />
      {/* Voksen — silhuet */}
      <path d="M 150 148 C 142 122 144 98 156 88 C 168 80 180 84 182 94 C 184 104 180 114 174 118" {...S} />
      {/* Barnevognens håndtag + hjul */}
      <path d="M 174 118 L 210 118" {...S} />
      <path d="M 210 118 L 214 148" {...S} />
      <path d="M 190 148 L 220 148" {...S} />
      <circle cx="196" cy="152" r="4" fill="none" stroke={P.ink} strokeOpacity="0.7" strokeWidth="1.2" />
      <circle cx="218" cy="152" r="4" fill="none" stroke={P.ink} strokeOpacity="0.7" strokeWidth="1.2" />
      {/* Barnevognens kurv */}
      <path d="M 188 118 c -2 8 0 20 6 24 c 10 4 22 2 26 -4 c 2 -4 0 -14 -2 -20 z" {...S} />
    </svg>
  );
}

/* 12 — ROLIG STUND PÅ ARMEN · quiet_observation, stående voksen holder baby */
export function CalmOnArm(_: SceneProps) {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={svgStyle} aria-hidden>
      <rect width="300" height="180" fill={P.ivory} />
      {/* Blødt lysfelt bagved */}
      <circle cx="200" cy="70" r="46" fill={P.butter} opacity="0.4" />
      {/* Vindueskant antydning */}
      <path d="M 240 20 L 240 160" stroke={P.ink} strokeOpacity="0.15" strokeWidth="1" />
      {/* Voksen — stående profil */}
      <path d="M 120 172 C 108 138 108 96 124 76 C 138 60 158 62 164 76 C 168 88 164 104 158 112 C 152 118 150 126 154 132 C 158 138 156 148 150 154 C 146 158 140 164 138 172" {...S} />
      {/* Voksens arm om baby */}
      <path d="M 158 118 c 10 -2 22 4 30 14" {...S} />
      {/* Baby ligger mod voksens skulder — hovedet hviler */}
      <path d="M 152 92 c 0 -12 18 -14 26 -6 c 6 6 4 18 -6 22 c -10 4 -20 -4 -20 -16 z" {...S} />
      <path d="M 158 98 c 0 -2 2 -3 4 -3" {...THIN} />
      {/* Babys lille hånd */}
      <path d="M 180 110 c 6 -2 12 -1 16 4" {...S} />
      {/* Rolig åndedrætskurve */}
      <path d="M 170 60 q 10 -6 20 -2" stroke={P.clay} strokeWidth="1" fill="none" strokeDasharray="1 3" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

export const MICRO_STORY_RENDERERS: Record<MicroStoryKey, React.FC<SceneProps>> = {
  face_to_face: FaceToFace,
  soft_kicks: SoftKicks,
  leaf_moving: LeafMoving,
  words_we_see: WordsWeSee,
  changing_song: ChangingSong,
  bath_time: BathTime,
  tummy_play: TummyPlay,
  reaching_object: ReachingObject,
  singing_music: SingingMusic,
  book_language: BookLanguage,
  outdoor_walk: OutdoorWalk,
  calm_on_arm: CalmOnArm,
};

export const MICRO_STORIES: MicroStoryMeta[] = [
  {
    id: "face_to_face",
    title: "Ansigt til ansigt",
    composition: "close_relationship",
    brief: "Voksen og baby ansigt mod ansigt med blødt lysfelt bagved og en lille turtagningsbue mellem dem.",
    elements: ["voksen profil", "baby profil", "blikretning", "turtagningsbue", "lydprikker"],
    is_gold: true,
  },
  {
    id: "soft_kicks",
    title: "Bløde spark",
    composition: "top_down_moment",
    brief: "Set fra oven: babys underkrop og små fødder møder to voksne hænder — spark og svar.",
    elements: ["baby underkrop", "to fødder", "to voksne hænder", "bevægelseskurver"],
  },
  {
    id: "leaf_moving",
    title: "Bladet der bevæger sig",
    composition: "outdoor_environment",
    brief: "Babyprofil nederst kigger op mod et stort blad der blafrer i en rolig vindkurve.",
    elements: ["babyprofil", "stort blad", "vindkurve", "vinduesramme", "græsstrå"],
  },
  {
    id: "words_we_see",
    title: "Ord for det vi ser",
    composition: "room_environment",
    brief: "Voksen og baby set bagfra ser mod et vindue med ét genkendeligt objekt udenfor. Diskret talemarke.",
    elements: ["voksen bagfra", "baby på arm", "vindue", "objekt udenfor", "talemarke"],
  },
  {
    id: "changing_song",
    title: "Puslebordets sang",
    composition: "sound_music_scene",
    brief: "Baby på puslepuden, en voksens hånd, og to–tre lydkurver der svæver ovenover.",
    elements: ["pusleunderlag", "baby", "voksens hånd", "lydkurver", "note"],
  },
  {
    id: "bath_time",
    title: "Badestund",
    composition: "caregiver_hands_and_baby",
    brief: "Babys hoved over vand, to voksne hænder støtter under nakke og ryg. Små plask.",
    elements: ["kar", "vandlinjer", "baby hoved", "to voksne hænder", "plask"],
  },
  {
    id: "tummy_play",
    title: "Maveliggende leg",
    composition: "side_profile_moment",
    brief: "Baby mave-liggende med hovedet løftet, voksens ansigt i babys øjenhøjde — blikretning mellem dem.",
    elements: ["baby mave-liggende", "voksen ansigt i øjenhøjde", "blikretning", "gulvtæppe"],
  },
  {
    id: "reaching_object",
    title: "Gribe efter genstand",
    composition: "object_and_baby",
    brief: "Babys arm strakt frem mod en rangle som en voksens hånd tilbyder. Blød bevægelseskurve.",
    elements: ["baby halvfigur", "strakt arm", "voksens hånd", "rangle", "bevægelseskurve"],
  },
  {
    id: "singing_music",
    title: "Sang og musik",
    composition: "sound_music_scene",
    brief: "Voksen holder baby på skødet, lydkurver og en note svæver blidt i rummet.",
    elements: ["voksen siddende", "baby på skød", "voksens arm om baby", "lydkurver", "note"],
  },
  {
    id: "book_language",
    title: "Bog og sprog",
    composition: "object_and_baby",
    brief: "Voksen og baby læser sammen — en åben bog i forgrunden og voksens finger peger.",
    elements: ["voksen", "baby på skød", "åben bog", "pegende finger", "talemarke"],
  },
  {
    id: "outdoor_walk",
    title: "Udendørs gåtur",
    composition: "outdoor_environment",
    brief: "Voksen skubber barnevogn ad en sti mellem to træer — rolig og luftig komposition.",
    elements: ["voksen silhuet", "barnevogn", "sti", "to træer", "horisont"],
  },
  {
    id: "calm_on_arm",
    title: "Rolig stund på armen",
    composition: "quiet_observation",
    brief: "Baby hviler mod voksens skulder ved et vindue — ét blødt lysfelt, meget stilhed.",
    elements: ["voksen stående", "baby på skulder", "voksens arm om baby", "vindueslys", "åndedrætskurve"],
  },
];
