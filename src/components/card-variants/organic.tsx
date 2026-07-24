import type { PrintContent } from "@/lib/card-schema";
import { AGE_LABELS, type AgeGroup } from "@/lib/card-schema";
import { CARD_FORMAT } from "@/lib/card-format";
import { cardShell, cardTrim, FaceToFaceIllustration, Blob, P } from "./shared";

interface Props {
  print: Partial<PrintContent>;
  scale?: number;
}

/**
 * B — ORGANIC
 * Bløde farveformer bag indholdet. Illustrationen integreret med en organisk blob.
 * Sektioner ligger ovenpå svage tonale flader.
 */
export function OrganicFront({ print, scale = 1 }: Props) {
  const { safe } = CARD_FORMAT;
  const age = (print.age_group as AgeGroup) ?? "2-4m";
  const areas = (print.development_areas ?? []).slice(0, 3);

  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        {/* Organiske baggrundsformer */}
        <Blob
          d="M 12,8 C 55,-2 80,10 92,28 C 104,46 84,60 60,58 C 40,56 8,52 4,32 C 1,20 4,12 12,8 Z"
          fill={P.sage}
          opacity={0.55}
          style={{
            position: "absolute",
            top: `-${8 * scale}mm`,
            right: `-${18 * scale}mm`,
            width: `${95 * scale}mm`,
            height: `${75 * scale}mm`,
          }}
        />
        <Blob
          d="M 8,20 C 30,4 68,10 90,30 C 108,48 90,70 62,72 C 30,74 4,58 2,40 C 1,32 3,26 8,20 Z"
          fill={P.butter}
          opacity={0.45}
          style={{
            position: "absolute",
            bottom: `-${18 * scale}mm`,
            left: `-${18 * scale}mm`,
            width: `${100 * scale}mm`,
            height: `${70 * scale}mm`,
          }}
        />
        <Blob
          d="M 20,10 C 60,0 90,20 88,50 C 86,80 40,88 18,72 C 0,60 -2,26 20,10 Z"
          fill={P.clay}
          opacity={0.18}
          style={{
            position: "absolute",
            top: `${10 * scale}mm`,
            right: `-${10 * scale}mm`,
            width: `${45 * scale}mm`,
            height: `${45 * scale}mm`,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: `${safe * scale}mm`,
            display: "flex",
            flexDirection: "column",
            gap: `${2.5 * scale}mm`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div
                style={{
                  fontSize: `${6 * scale}pt`,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: `${P.ink}90`,
                }}
              >
                {AGE_LABELS[age]}
              </div>
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  fontWeight: 500,
                  fontSize: `${26 * scale}pt`,
                  lineHeight: 1.04,
                  letterSpacing: "-0.012em",
                  color: P.ink,
                  margin: `${1 * scale}mm 0 0 0`,
                  maxWidth: `${70 * scale}mm`,
                }}
              >
                {print.title || "Uden titel"}
              </h2>
            </div>
            <FaceToFaceIllustration scale={scale} size={24} accent={P.clay} />
          </div>

          {/* Tags som prikker mellem */}
          {areas.length > 0 && (
            <div style={{ fontSize: `${8 * scale}pt`, color: `${P.ink}A0`, letterSpacing: "0.04em" }}>
              {areas.join("  ·  ")}
            </div>
          )}

          {/* Intro */}
          {print.intro && (
            <p
              style={{
                fontSize: `${9.5 * scale}pt`,
                lineHeight: 1.4,
                color: `${P.ink}CC`,
                margin: 0,
                maxWidth: `${78 * scale}mm`,
              }}
            >
              {print.intro}
            </p>
          )}

          {/* Sådan gør I */}
          <div style={{ marginTop: `${1 * scale}mm` }}>
            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: `${12 * scale}pt`,
                color: P.ink,
                marginBottom: `${2 * scale}mm`,
              }}
            >
              Sådan gør I
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: `${1.8 * scale}mm` }}>
              {(print.steps ?? []).map((s, i) => (
                <li key={i} style={{ display: "flex", gap: `${2.2 * scale}mm`, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: `${5.5 * scale}mm`,
                      height: `${5.5 * scale}mm`,
                      borderRadius: "999px",
                      background: P.ivory,
                      border: `0.3mm solid ${P.clay}`,
                      color: P.clay,
                      fontFamily: "Fraunces, serif",
                      fontSize: `${9 * scale}pt`,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      marginTop: `${0.3 * scale}mm`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: `${10 * scale}pt`, lineHeight: 1.35, color: P.ink }}>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ flex: 1 }} />

          {/* Se efter / Pause hvis ovenpå bløde tonale flader */}
          <div style={{ display: "flex", flexDirection: "column", gap: `${1.5 * scale}mm` }}>
            {print.look_for && (
              <TonedRow scale={scale} label="Se efter" tone={P.sage}>
                {print.look_for}
              </TonedRow>
            )}
            {print.pause_if && (
              <TonedRow scale={scale} label="Pause hvis" tone={P.sand}>
                {print.pause_if}
              </TonedRow>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TonedRow({
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
    <div
      style={{
        position: "relative",
        padding: `${2 * scale}mm ${3 * scale}mm`,
        borderRadius: `${3 * scale}mm`,
        background: `color-mix(in oklab, ${tone} 55%, transparent)`,
      }}
    >
      <div
        style={{
          fontSize: `${6.5 * scale}pt`,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: `${P.ink}A0`,
          marginBottom: `${0.6 * scale}mm`,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: `${9 * scale}pt`, color: P.ink, lineHeight: 1.35 }}>{children}</div>
    </div>
  );
}
