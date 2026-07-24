import type { PrintContent } from "@/lib/card-schema";
import { AGE_LABELS, type AgeGroup } from "@/lib/card-schema";
import { CARD_FORMAT } from "@/lib/card-format";
import { cardShell, cardTrim, P } from "./shared";
import { SCENE_RENDERERS, type SceneKey } from "./scenes";

interface Props {
  print: Partial<PrintContent>;
  scale?: number;
  /** Ny: vælg hvilken scene-komposition der skal vises øverst. */
  scene?: SceneKey;
}

/**
 * C — MINIMAL STORYBOOK
 * Style lock (streg, palette, negativt rum) er fælles. Scenen varierer per kort.
 */
export function StorybookFront({ print, scale = 1, scene = "face" }: Props) {
  const { safe, trim } = CARD_FORMAT;
  const age = (print.age_group as AgeGroup) ?? "2-4m";
  const areas = (print.development_areas ?? []).slice(0, 3);
  const sceneH = 62; // mm

  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        {/* Scene øverst */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: `${sceneH * scale}mm`,
            background: `linear-gradient(180deg, ${P.mist}66 0%, ${P.ivory} 100%)`,
            overflow: "hidden",
          }}
        >
          <FaceToFaceScene scale={scale} />
        </div>

        {/* Diskret vandret linje */}
        <div
          style={{
            position: "absolute",
            top: `${sceneH * scale}mm`,
            left: `${safe * scale}mm`,
            right: `${safe * scale}mm`,
            height: 0,
            borderTop: `0.2mm solid ${P.ink}22`,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: `${(sceneH + 4) * scale}mm`,
            left: `${safe * scale}mm`,
            right: `${safe * scale}mm`,
            bottom: `${safe * scale}mm`,
            display: "flex",
            flexDirection: "column",
            gap: `${2 * scale}mm`,
          }}
        >
          {/* Titel */}
          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                fontSize: `${22 * scale}pt`,
                lineHeight: 1.05,
                margin: 0,
                color: P.ink,
              }}
            >
              {print.title || "Uden titel"}
            </h2>
            <div
              style={{
                marginTop: `${1 * scale}mm`,
                fontSize: `${7.5 * scale}pt`,
                color: `${P.ink}A0`,
                letterSpacing: "0.06em",
              }}
            >
              {AGE_LABELS[age]}
              {areas.length ? `   ·   ${areas.join(" · ")}` : ""}
            </div>
          </div>

          {print.intro && (
            <p
              style={{
                fontSize: `${9 * scale}pt`,
                color: `${P.ink}C0`,
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {print.intro}
            </p>
          )}

          {/* Steps — meget rolige, med håndtegnede cirkler */}
          <ol
            style={{
              margin: `${1 * scale}mm 0 0 0`,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: `${1.6 * scale}mm`,
            }}
          >
            {(print.steps ?? []).map((s, i) => (
              <li key={i} style={{ display: "flex", gap: `${2.2 * scale}mm`, alignItems: "flex-start" }}>
                <HandDrawnNumber n={i + 1} scale={scale} />
                <span style={{ fontSize: `${9.5 * scale}pt`, lineHeight: 1.4, color: P.ink }}>{s}</span>
              </li>
            ))}
          </ol>

          <div style={{ flex: 1 }} />

          {/* Support — som fortalt af en stemme */}
          <div style={{ display: "flex", flexDirection: "column", gap: `${1 * scale}mm` }}>
            {print.look_for && (
              <StoryLine scale={scale} label="Se efter" tone={P.sage}>
                {print.look_for}
              </StoryLine>
            )}
            {print.pause_if && (
              <StoryLine scale={scale} label="Pause hvis" tone={P.clay}>
                {print.pause_if}
              </StoryLine>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HandDrawnNumber({ n, scale }: { n: number; scale: number }) {
  const s = 5.5 * scale;
  return (
    <svg width={`${s}mm`} height={`${s}mm`} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: `${0.4 * scale}mm` }} aria-hidden>
      <path
        d="M 12 2 C 18 2 22 6 22 12 C 22 18 18 22 12 22 C 6 22 2 18.2 2 12 C 2 5.8 6.2 2 12 2 Z"
        fill="none"
        stroke={P.ink}
        strokeOpacity="0.55"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="12"
        fill={P.ink}
      >
        {n}
      </text>
    </svg>
  );
}

function StoryLine({
  label,
  children,
  scale,
  tone,
}: {
  label: string;
  children: React.ReactNode;
  scale: number;
  tone: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: `${2 * scale}mm` }}>
      <span
        style={{
          display: "inline-block",
          width: `${2 * scale}mm`,
          height: `${2 * scale}mm`,
          borderRadius: "999px",
          background: tone,
          marginTop: `${1.2 * scale}mm`,
          flexShrink: 0,
        }}
      />
      <div style={{ fontSize: `${8.5 * scale}pt`, color: `${P.ink}CC`, lineHeight: 1.4 }}>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: P.ink,
            marginRight: `${1 * scale}mm`,
          }}
        >
          {label}:
        </span>
        {children}
      </div>
    </div>
  );
}

/** Enkel scene: to blide profiler i tone-i-tone, tæppe, blad. */
function FaceToFaceScene({ scale }: { scale: number }) {
  return (
    <svg
      viewBox="0 0 300 180"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden
    >
      {/* Horisont / gulv */}
      <path d="M 0 140 Q 150 120 300 140 L 300 180 L 0 180 Z" fill={P.sand} opacity="0.65" />
      {/* Blødt lys bag hovederne */}
      <circle cx="150" cy="88" r="60" fill={P.butter} opacity="0.55" />
      {/* Adult (venstre) — enkel profil */}
      <path
        d="M 90 150 C 82 130 82 105 92 90 C 102 74 122 70 132 82 C 138 90 138 100 134 106 C 130 112 130 118 134 122 C 138 126 134 132 130 134 C 126 136 128 144 132 148"
        fill="none"
        stroke={P.ink}
        strokeOpacity="0.7"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="118" cy="94" r="1.6" fill={P.ink} opacity="0.75" />
      {/* Baby (højre) — mindre */}
      <path
        d="M 210 150 C 216 132 216 112 208 100 C 200 88 184 86 176 96 C 172 102 172 110 176 114 C 180 118 180 122 176 124 C 172 126 176 132 180 134"
        fill="none"
        stroke={P.ink}
        strokeOpacity="0.7"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="188" cy="108" r="1.4" fill={P.ink} opacity="0.75" />
      {/* Turtagnings-lyd */}
      <path d="M 140 82 Q 165 62 195 84" stroke={P.clay} strokeWidth="1.2" fill="none" strokeDasharray="1 3" strokeLinecap="round" />
      <circle cx="167" cy="70" r="1.6" fill={P.clay} />
      <circle cx="176" cy="72" r="1.1" fill={P.clay} opacity="0.7" />
      {/* Lille blad-detalje nederst højre */}
      <path d="M 260 152 q 8 -6 14 2 q -6 6 -14 -2 z" fill={P.sage} opacity="0.8" />
      <path d="M 260 152 q 6 -3 12 0" stroke={P.ink} strokeOpacity="0.4" strokeWidth="0.6" fill="none" />
    </svg>
  );
}
