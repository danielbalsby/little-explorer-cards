import { CARD_FORMAT } from "@/lib/card-format";
import { cardShell, cardTrim, P } from "./shared";
import { RelationMark, type RelationMarkVariant } from "./brandmarks-v2";

/**
 * V5 — BACK ROUND 3 · Små Stunder
 *
 * Regler:
 * - Ét klart hovedmotiv, ingen tapet, ingen wellness.
 * - Genkendelig på afstand og i en bunke.
 * - Ingen tagline. Kun brandnavnet.
 * - Fungerer roteret 180° uden at føles forkert vendt.
 */
export type BackV3Variant = "quiet_story" | "little_response" | "colour_field" | "story_emblem";

export const BACK_V3_VARIANTS: Array<{
  id: BackV3Variant;
  name: string;
  description: string;
}> = [
  {
    id: "quiet_story",
    name: "H1 · Quiet Story",
    description:
      "Full-bleed lys støvet blå/salvie med en stor blød solform i centrum. Brandmark foran. Meget stilhed.",
  },
  {
    id: "little_response",
    name: "H2 · Little Response",
    description:
      "Ivory baggrund. To små profil-former og en koralfarvet punkteret kurve som svar imellem.",
  },
  {
    id: "colour_field",
    name: "H3 · Colour Field",
    description:
      "Modig muted sage-flade. Brandmark og navn i varm ivory. Én meget subtil organisk form.",
  },
  {
    id: "story_emblem",
    name: "H4 · Story Emblem",
    description:
      "En lille poetisk scene reduceret til et emblem: to figurer og et lille svar imellem — meget luft.",
  },
];

export interface BackV3Props {
  scale?: number;
  brandName?: string;
  brandmark?: RelationMarkVariant;
}

function BrandName({ brandName, scale, color = P.ink }: { brandName: string; scale: number; color?: string }) {
  return (
    <div style={{
      fontFamily: "'Fraunces', 'Cormorant Garamond', serif",
      fontWeight: 500,
      fontSize: `${14.5 * scale}pt`,
      letterSpacing: "0.02em",
      color,
      lineHeight: 1,
    }}>
      {brandName}
    </div>
  );
}

/* ---------------- H1 — Quiet Story ---------------- */
export function BackQuietStory({
  scale = 1, brandName = "Små Stunder", brandmark = "two_profiles",
}: BackV3Props) {
  const { safe } = CARD_FORMAT;
  const BG = "#E4E9EA"; // støvet blå/salvie
  return (
    <div style={cardShell(scale)}>
      <div style={{ ...cardTrim(scale, BG) }}>
        {/* Stor blød solform */}
        <svg viewBox="0 0 210 296" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
          <circle cx="105" cy="130" r="72" fill={P.ivory} opacity="0.75" />
          <circle cx="105" cy="130" r="72" fill="none" stroke={P.ink} strokeOpacity="0.08" strokeWidth="0.6" />
        </svg>

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: `${5 * scale}mm`,
          padding: `${safe * scale}mm`,
        }}>
          <RelationMark variant={brandmark} size={24} scale={scale} />
          <BrandName brandName={brandName} scale={scale} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- H2 — Little Response ---------------- */
export function BackLittleResponse({
  scale = 1, brandName = "Små Stunder", brandmark = "two_profiles",
}: BackV3Props) {
  const { safe } = CARD_FORMAT;
  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        {/* Centralt visuel: to små former + et koralfarvet svar imellem */}
        <svg viewBox="0 0 210 296"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
          {/* Venstre lille form */}
          <path d="M 76 128 C 68 116 74 100 88 102 C 100 104 102 122 92 128 C 86 132 80 132 76 128 Z"
            fill="none" stroke={P.ink} strokeOpacity="0.72" strokeWidth="1.6" strokeLinejoin="round" />
          {/* Højre lille form (mindre) */}
          <path d="M 122 132 C 116 122 124 112 132 116 C 138 120 136 130 130 132 C 126 134 124 134 122 132 Z"
            fill="none" stroke={P.ink} strokeOpacity="0.72" strokeWidth="1.6" strokeLinejoin="round" />
          {/* Koralfarvet punkteret kurve som svar */}
          <path d="M 96 112 Q 105 96 122 114"
            stroke={P.clay} strokeWidth="1.4" fill="none"
            strokeLinecap="round" strokeDasharray="1 2.6" />
          <circle cx="108" cy="102" r="1.5" fill={P.clay} />
        </svg>

        {/* Navn nederst */}
        <div style={{
          position: "absolute",
          bottom: `${(safe + 10) * scale}mm`,
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}>
          <BrandName brandName={brandName} scale={scale} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- H3 — Colour Field ---------------- */
export function BackColourField({
  scale = 1, brandName = "Små Stunder", brandmark = "two_profiles",
}: BackV3Props) {
  const { safe } = CARD_FORMAT;
  const BG = "#8FA290"; // muted sage — mere modig
  return (
    <div style={cardShell(scale)}>
      <div style={{ ...cardTrim(scale, BG) }}>
        {/* Subtil organisk form i lidt lysere tone */}
        <svg viewBox="0 0 210 296" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
          <path d="M -20 200 C 40 160 160 260 240 200 L 240 320 L -20 320 Z"
            fill={P.ivory} opacity="0.10" />
        </svg>

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: `${5 * scale}mm`,
          padding: `${safe * scale}mm`,
        }}>
          <RelationMark variant={brandmark} size={24} scale={scale} color={P.ivory} accent={P.butter} />
          <BrandName brandName={brandName} scale={scale} color={P.ivory} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- H4 — Story Emblem ---------------- */
export function BackStoryEmblem({
  scale = 1, brandName = "Små Stunder", brandmark = "two_profiles",
}: BackV3Props) {
  const { safe } = CARD_FORMAT;
  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        {/* Emblem: to figurer + et lille svar imellem, meget negativ plads */}
        <svg viewBox="0 0 210 296"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
          {/* Blødt lysfelt bagved */}
          <circle cx="105" cy="128" r="46" fill={P.butter} opacity="0.35" />
          {/* Voksen profil (større, venstre) */}
          <path d="M 78 156 C 72 138 72 116 82 106 C 90 100 100 102 104 110 C 106 116 104 122 100 124 C 98 126 98 130 100 132"
            fill="none" stroke={P.ink} strokeOpacity="0.8" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
          {/* Baby profil (mindre, højre) */}
          <path d="M 138 156 C 142 142 142 124 136 116 C 130 110 122 112 120 118 C 119 122 121 126 123 128 C 125 130 124 132 122 134"
            fill="none" stroke={P.ink} strokeOpacity="0.8" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
          {/* Svar imellem */}
          <path d="M 106 106 Q 116 92 128 108"
            stroke={P.clay} strokeWidth="1.2" fill="none" strokeDasharray="1 2.4" strokeLinecap="round" />
          <circle cx="117" cy="98" r="1.4" fill={P.clay} />
        </svg>

        <div style={{
          position: "absolute",
          bottom: `${(safe + 12) * scale}mm`,
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}>
          <BrandName brandName={brandName} scale={scale} />
        </div>
      </div>
    </div>
  );
}

export const BACK_V3_RENDERERS: Record<BackV3Variant, React.FC<BackV3Props>> = {
  quiet_story: BackQuietStory,
  little_response: BackLittleResponse,
  colour_field: BackColourField,
  story_emblem: BackStoryEmblem,
};
