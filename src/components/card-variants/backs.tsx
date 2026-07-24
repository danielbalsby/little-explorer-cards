import { CARD_FORMAT } from "@/lib/card-format";
import { cardShell, cardTrim, P } from "./shared";

/** Fælles props til alle bagsider. */
export interface CardBackProps {
  scale?: number;
  brandName?: string;
  tagline?: string;
  showTagline?: boolean;
}

export type BackVariant = "iconic_minimal" | "storybook_emblem" | "organic_pattern";

export const BACK_VARIANTS: Array<{
  id: BackVariant;
  name: string;
  tagline: string;
  description: string;
}> = [
  {
    id: "iconic_minimal",
    name: "A · Iconic Minimal",
    tagline: "Brandmark · meget luft",
    description:
      "Ét roligt monogram i midten, omgivet af diskrete linjer og et fint brandnavn nederst. Bagsiden er stille — kortet taler når det vendes.",
  },
  {
    id: "storybook_emblem",
    name: "B · Storybook Emblem",
    tagline: "Poetisk lille univers om mærket",
    description:
      "Brandmarket sidder inde i en varm sol med små blade, en stjerne og en blød horisont. Genkendes tydeligt selv på afstand i en bunke.",
  },
  {
    id: "organic_pattern",
    name: "C · Organic Pattern",
    tagline: "Blidt gentaget mønster · centralt mærke",
    description:
      "Meget subtilt organisk bladmønster over hele fladen, med brandmark i en rolig cirkel i midten. Virker som stof.",
  },
];

/** Fælles brandmark — et diskret 'b' i cirkel; kan senere erstattes af rigtigt logo. */
export function Brandmark({
  size = 22,
  scale = 1,
  color = P.ink,
  ring = 0.35,
}: {
  size?: number;
  scale?: number;
  color?: string;
  ring?: number;
}) {
  const s = size * scale;
  return (
    <svg
      viewBox="0 0 100 100"
      width={`${s}mm`}
      height={`${s}mm`}
      aria-hidden
      style={{ display: "block" }}
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeOpacity={ring}
        strokeWidth="1"
      />
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', 'Fraunces', serif"
        fontStyle="italic"
        fontSize="54"
        fill={color}
      >
        b
      </text>
    </svg>
  );
}

function TaglineText({
  text,
  scale,
  size = 6.5,
}: {
  text: string;
  scale: number;
  size?: number;
}) {
  return (
    <div
      style={{
        fontSize: `${size * scale}pt`,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: `${P.ink}88`,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {text}
    </div>
  );
}

function BrandName({ name, scale }: { name: string; scale: number }) {
  return (
    <div
      style={{
        fontFamily: "'Cormorant Garamond', 'Fraunces', serif",
        fontSize: `${13 * scale}pt`,
        letterSpacing: "0.08em",
        color: P.ink,
      }}
    >
      {name}
    </div>
  );
}

/** A · ICONIC MINIMAL — brandmark i midten, meget hvidt rum, diskret navn. */
export function BackIconicMinimal({
  scale = 1,
  brandName = "Babykort",
  tagline = "Små stunder sammen",
  showTagline = true,
}: CardBackProps) {
  const { safe } = CARD_FORMAT;
  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        {/* Diskret dobbeltramme */}
        <div
          style={{
            position: "absolute",
            inset: `${(safe - 1) * scale}mm`,
            border: `0.25mm solid ${P.ink}22`,
            borderRadius: `${(CARD_FORMAT.cornerRadius - 2) * scale}mm`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: `${safe * scale}mm`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: `${8 * scale}mm`,
            paddingBottom: `${6 * scale}mm`,
          }}
        >
          <TaglineText text="Est. 2026" scale={scale} size={5.5} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: `${4 * scale}mm` }}>
            <Brandmark size={30} scale={scale} />
            <div style={{ display: "flex", alignItems: "center", gap: `${2 * scale}mm` }}>
              <span style={{ width: `${8 * scale}mm`, height: 0, borderTop: `0.3mm solid ${P.ink}55` }} />
              <BrandName name={brandName} scale={scale} />
              <span style={{ width: `${8 * scale}mm`, height: 0, borderTop: `0.3mm solid ${P.ink}55` }} />
            </div>
            {showTagline && (
              <div style={{ marginTop: `${1 * scale}mm` }}>
                <TaglineText text={tagline} scale={scale} />
              </div>
            )}
          </div>

          <TaglineText text="0 — 12 mdr" scale={scale} size={5.5} />
        </div>
      </div>
    </div>
  );
}

/** B · STORYBOOK EMBLEM — brandmark i et lille varmt univers. */
export function BackStorybookEmblem({
  scale = 1,
  brandName = "Babykort",
  tagline = "Leg · nærvær · nysgerrighed",
  showTagline = true,
}: CardBackProps) {
  const { safe } = CARD_FORMAT;
  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        <div
          style={{
            position: "absolute",
            inset: `${safe * scale}mm`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ height: `${2 * scale}mm` }} />

          {/* Poetisk emblem */}
          <div style={{ position: "relative", width: `${72 * scale}mm`, height: `${72 * scale}mm` }}>
            <svg
              viewBox="0 0 200 200"
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0 }}
              aria-hidden
            >
              {/* Blød sol */}
              <circle cx="100" cy="100" r="70" fill={P.butter} opacity="0.55" />
              {/* Horisont / bakke */}
              <path
                d="M 20 128 Q 100 108 180 128"
                fill="none"
                stroke={P.sage}
                strokeOpacity="0.75"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              {/* Blade venstre */}
              <path
                d="M 44 118 q 8 -10 18 -4 q -6 10 -18 4 z"
                fill={P.sage}
                opacity="0.85"
              />
              <path d="M 46 118 q 6 -5 14 -2" stroke={P.ink} strokeOpacity="0.35" strokeWidth="0.6" fill="none" />
              {/* Stjerne højre */}
              <g stroke={P.clay} strokeWidth="1" strokeLinecap="round" fill="none">
                <path d="M 148 82 L 148 92" />
                <path d="M 143 87 L 153 87" />
                <path d="M 144 83 L 152 91" />
                <path d="M 152 83 L 144 91" />
              </g>
              {/* Stiplet turtagningsbue */}
              <path
                d="M 60 96 Q 100 60 140 96"
                stroke={P.clay}
                strokeOpacity="0.7"
                strokeWidth="0.9"
                fill="none"
                strokeDasharray="1 3"
                strokeLinecap="round"
              />
              {/* Ringkant */}
              <circle cx="100" cy="100" r="86" fill="none" stroke={P.ink} strokeOpacity="0.18" strokeWidth="0.8" />
            </svg>
            {/* Centralt brandmark */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: `${P.ivory}F0`,
                  borderRadius: "999px",
                  padding: `${1.5 * scale}mm`,
                }}
              >
                <Brandmark size={20} scale={scale} ring={0.5} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: `${1.5 * scale}mm`, marginBottom: `${2 * scale}mm` }}>
            <BrandName name={brandName} scale={scale} />
            {showTagline && <TaglineText text={tagline} scale={scale} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/** C · ORGANIC PATTERN — subtilt bladmønster over fladen, roligt centralmærke. */
export function BackOrganicPattern({
  scale = 1,
  brandName = "Babykort",
  tagline = "Små stunder sammen",
  showTagline = true,
}: CardBackProps) {
  const { safe } = CARD_FORMAT;
  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        {/* Mønster-lag */}
        <svg
          viewBox="0 0 210 296"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          aria-hidden
        >
          <defs>
            <pattern id="leaves" x="0" y="0" width="36" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
              {/* Blad 1 */}
              <path d="M 8 20 q 6 -10 14 -4 q -4 12 -14 4 z" fill={P.sage} opacity="0.35" />
              <path d="M 9 20 q 6 -6 13 -3" stroke={P.ink} strokeOpacity="0.12" strokeWidth="0.4" fill="none" />
              {/* Prik */}
              <circle cx="28" cy="6" r="0.9" fill={P.clay} opacity="0.35" />
              {/* Lille bue */}
              <path d="M 2 34 q 8 -4 16 0" stroke={P.mist} strokeOpacity="0.55" strokeWidth="0.4" fill="none" />
            </pattern>
            <radialGradient id="fade" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor={P.ivory} stopOpacity="0.95" />
              <stop offset="60%" stopColor={P.ivory} stopOpacity="0.35" />
              <stop offset="100%" stopColor={P.ivory} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="210" height="296" fill="url(#leaves)" />
          {/* Blødt center-fade så brandmark får luft */}
          <rect x="0" y="0" width="210" height="296" fill="url(#fade)" />
        </svg>

        {/* Diskret indre ramme */}
        <div
          style={{
            position: "absolute",
            inset: `${(safe - 0.5) * scale}mm`,
            border: `0.25mm solid ${P.ink}18`,
            borderRadius: `${(CARD_FORMAT.cornerRadius - 2) * scale}mm`,
          }}
        />

        {/* Centralmærke */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: `${3 * scale}mm`,
          }}
        >
          <div
            style={{
              background: `${P.ivory}F2`,
              borderRadius: "999px",
              padding: `${3 * scale}mm`,
              boxShadow: `0 0.4mm 1.2mm ${P.ink}18`,
            }}
          >
            <Brandmark size={22} scale={scale} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: `${1.2 * scale}mm` }}>
            <BrandName name={brandName} scale={scale} />
            {showTagline && <TaglineText text={tagline} scale={scale} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export const BACK_RENDERERS: Record<
  BackVariant,
  React.FC<CardBackProps>
> = {
  iconic_minimal: BackIconicMinimal,
  storybook_emblem: BackStorybookEmblem,
  organic_pattern: BackOrganicPattern,
};
