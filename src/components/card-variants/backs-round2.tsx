import { CARD_FORMAT } from "@/lib/card-format";
import { cardShell, cardTrim, P } from "./shared";
import { Brandmark, type BrandmarkVariant } from "./brandmarks";

export type BackRound2Variant = "little_moment" | "soft_story_emblem" | "tiny_constellation";

export const BACK_ROUND2_VARIANTS: Array<{
  id: BackRound2Variant;
  name: string;
  tagline: string;
  description: string;
}> = [
  {
    id: "little_moment",
    name: "D · Little Moment",
    tagline: "Meget luft · moderne · roligt centrum",
    description:
      "Brandmarket i midten med stor negativ plads. 2–4 diskrete håndtegnede elementer omkring — blad, prik, kurve, mini-stjerne.",
  },
  {
    id: "soft_story_emblem",
    name: "E · Soft Story Emblem",
    tagline: "Ét emblem · let organisk · lille scene",
    description:
      "En let organisk form som holder brandmarket sammen med en meget enkel lille scene. Ikke en perfekt cirkel-i-cirkel.",
  },
  {
    id: "tiny_constellation",
    name: "F · Tiny Constellation",
    tagline: "Poetisk konstellation · ikke tapet",
    description:
      "Maks. 6–10 små håndtegnede symboler spredt sparsomt omkring brandmarket. Skal føles som en lille poetisk konstellation.",
  },
];

export interface BackRound2Props {
  scale?: number;
  brandName?: string;
  tagline?: string;
  showTagline?: boolean;
  brandmark?: BrandmarkVariant;
}

function BrandBlock({
  brandName,
  tagline,
  showTagline,
  scale,
  align = "center",
}: {
  brandName: string;
  tagline: string;
  showTagline: boolean;
  scale: number;
  align?: "center" | "start";
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: `${1 * scale}mm` }}>
      <div style={{
        fontFamily: "'Fraunces', 'Cormorant Garamond', serif",
        fontWeight: 500,
        fontSize: `${14 * scale}pt`,
        letterSpacing: "0.02em",
        color: P.ink,
        lineHeight: 1,
      }}>
        {brandName}
      </div>
      {showTagline && (
        <div style={{
          fontSize: `${6.5 * scale}pt`,
          color: `${P.ink}A0`,
          letterSpacing: "0.06em",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}>
          {tagline}
        </div>
      )}
    </div>
  );
}

/** D — LITTLE MOMENT: meget luft, 2–4 små diskrete elementer, brandmark i midten. */
export function BackLittleMoment({
  scale = 1, brandName = "Lille Nu", tagline = "Små stunder sammen",
  showTagline = true, brandmark = "relation",
}: BackRound2Props) {
  const { safe } = CARD_FORMAT;
  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        {/* Diskrete elementer med stor afstand */}
        <svg viewBox="0 0 210 296" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
          {/* Lille blad, øverst venstre */}
          <path d="M 34 44 q 8 -10 16 -2 q -6 10 -16 2 z" fill={P.sage} opacity="0.7" />
          {/* Prik, øverst højre */}
          <circle cx="176" cy="52" r="1.4" fill={P.clay} opacity="0.75" />
          {/* Blød kurve, nederst venstre */}
          <path d="M 26 244 q 20 -8 40 2" stroke={P.mist} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.85" />
          {/* Mini-stjerne, nederst højre */}
          <g stroke={P.clay} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.9">
            <path d="M 170 246 L 170 254" />
            <path d="M 166 250 L 174 250" />
          </g>
        </svg>

        {/* Centralt brandmark + navn */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: `${4 * scale}mm`,
          padding: `${safe * scale}mm`,
        }}>
          <Brandmark variant={brandmark} size={22} scale={scale} />
          <BrandBlock brandName={brandName} tagline={tagline} showTagline={showTagline} scale={scale} />
        </div>
      </div>
    </div>
  );
}

/** E — SOFT STORY EMBLEM: let organisk form holder brandmark + enkel scene. */
export function BackSoftStoryEmblem({
  scale = 1, brandName = "Små Stunder", tagline = "Leg, nærvær og nysgerrighed",
  showTagline = true, brandmark = "moment",
}: BackRound2Props) {
  const { safe } = CARD_FORMAT;
  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        <div style={{
          position: "absolute", inset: `${safe * scale}mm`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ height: `${4 * scale}mm` }} />

          <div style={{ position: "relative", width: `${74 * scale}mm`, height: `${80 * scale}mm` }}>
            <svg viewBox="0 0 200 220" width="100%" height="100%"
              style={{ position: "absolute", inset: 0 }} aria-hidden>
              {/* Let organisk emblem-form, ikke perfekt cirkel */}
              <path d="M 40 60 C 30 40 70 20 110 28 C 160 36 180 70 172 110 C 168 148 130 176 90 172 C 46 168 22 132 30 96 C 32 82 34 72 40 60 Z"
                fill={P.butter} opacity="0.42" />
              {/* Sol/kurve som lille scene */}
              <circle cx="82" cy="90" r="10" fill="none" stroke={P.clay} strokeOpacity="0.7" strokeWidth="1.2" />
              <path d="M 60 120 Q 100 96 140 118" stroke={P.sage} strokeOpacity="0.85" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              {/* Ganske lille blad */}
              <path d="M 130 82 q 8 -8 14 -2 q -6 8 -14 2 z" fill={P.sage} opacity="0.8" />
            </svg>
            {/* Brandmark centreret ovenpå */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ background: `${P.ivory}EE`, borderRadius: "999px", padding: `${1.5 * scale}mm` }}>
                <Brandmark variant={brandmark} size={20} scale={scale} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: `${4 * scale}mm` }}>
            <BrandBlock brandName={brandName} tagline={tagline} showTagline={showTagline} scale={scale} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** F — TINY CONSTELLATION: 6–10 små symboler sparsomt spredt. */
export function BackTinyConstellation({
  scale = 1, brandName = "Nær", tagline = "Små stunder sammen",
  showTagline = true, brandmark = "together",
}: BackRound2Props) {
  const { safe } = CARD_FORMAT;
  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        {/* Konstellation */}
        <svg viewBox="0 0 210 296" preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
          {/* 8 elementer — poetisk spredt, ikke gentaget mønster */}
          <path d="M 40 60 q 6 -6 12 0 q -4 8 -12 0 z" fill={P.sage} opacity="0.7" />
          <circle cx="168" cy="70" r="1.3" fill={P.clay} opacity="0.85" />
          <g stroke={P.clay} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.75">
            <path d="M 56 226 L 56 232" /><path d="M 53 229 L 59 229" />
          </g>
          <path d="M 152 218 q 12 -4 20 2" stroke={P.mist} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.85" />
          <circle cx="30" cy="150" r="1.1" fill={P.sage} opacity="0.8" />
          <path d="M 178 158 q 4 -4 8 0" stroke={P.clay} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
          <circle cx="98" cy="42" r="1" fill={P.mist} opacity="0.85" />
          <path d="M 118 254 q 4 -3 8 0" stroke={P.sage} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.75" />
        </svg>

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: `${3.5 * scale}mm`,
          padding: `${safe * scale}mm`,
        }}>
          <Brandmark variant={brandmark} size={20} scale={scale} />
          <BrandBlock brandName={brandName} tagline={tagline} showTagline={showTagline} scale={scale} />
        </div>
      </div>
    </div>
  );
}

export const BACK_ROUND2_RENDERERS: Record<BackRound2Variant, React.FC<BackRound2Props>> = {
  little_moment: BackLittleMoment,
  soft_story_emblem: BackSoftStoryEmblem,
  tiny_constellation: BackTinyConstellation,
};
