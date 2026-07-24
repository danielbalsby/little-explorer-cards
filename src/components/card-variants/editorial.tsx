import type { PrintContent } from "@/lib/card-schema";
import { AGE_LABELS, type AgeGroup } from "@/lib/card-schema";
import { CARD_FORMAT } from "@/lib/card-format";
import { cardShell, cardTrim, FaceToFaceIllustration, P } from "./shared";

interface Props {
  print: Partial<PrintContent>;
  scale?: number;
}

/**
 * A — EDITORIAL
 * Magazine-like. Titel som en bogtitel, meget luft, illustration som lille accent.
 * Support-sektioner som subtile tekstlinjer med typografisk hierarki.
 */
export function EditorialFront({ print, scale = 1 }: Props) {
  const { safe } = CARD_FORMAT;
  const age = (print.age_group as AgeGroup) ?? "2-4m";
  const areas = (print.development_areas ?? []).slice(0, 3);

  return (
    <div style={cardShell(scale)}>
      <div style={cardTrim(scale)}>
        <div
          style={{
            position: "absolute",
            inset: `${safe * scale}mm`,
            display: "flex",
            flexDirection: "column",
            gap: `${3 * scale}mm`,
          }}
        >
          {/* Header: kortlabel + lille illustration i hjørne */}
          <div className="flex items-start justify-between">
            <div
              style={{
                fontSize: `${6 * scale}pt`,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: `${P.ink}99`,
              }}
            >
              Babykort · Nr. 001
            </div>
            <FaceToFaceIllustration scale={scale} size={20} accent={P.sage} />
          </div>

          {/* Titel — som en bogtitel */}
          <div style={{ marginTop: `${4 * scale}mm` }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                fontSize: `${30 * scale}pt`,
                lineHeight: 1.02,
                letterSpacing: "-0.015em",
                color: P.ink,
                margin: 0,
              }}
            >
              {print.title || "Uden titel"}
            </h2>
            <div
              style={{
                marginTop: `${2 * scale}mm`,
                fontSize: `${8 * scale}pt`,
                color: `${P.ink}B0`,
                letterSpacing: "0.02em",
              }}
            >
              {AGE_LABELS[age]}
              {areas.length ? (
                <span style={{ color: `${P.ink}66` }}>
                  {"  ·  "}
                  {areas.join(" · ")}
                </span>
              ) : null}
            </div>
          </div>

          {/* Intro */}
          {print.intro && (
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: `${12 * scale}pt`,
                lineHeight: 1.35,
                color: `${P.ink}D0`,
                fontStyle: "italic",
                margin: 0,
                maxWidth: `${75 * scale}mm`,
              }}
            >
              {print.intro}
            </p>
          )}

          {/* Materialer — meget diskret linje */}
          {(!print.materials || print.materials.trim() === "") ? (
            <div style={{ fontSize: `${7 * scale}pt`, color: `${P.ink}80` }}>
              Intet skal findes frem.
            </div>
          ) : (
            <div style={{ fontSize: `${8 * scale}pt`, color: `${P.ink}B0` }}>
              Du skal bruge: {print.materials}
            </div>
          )}

          {/* Sådan gør I — kortets hjerte */}
          <div style={{ marginTop: `${1 * scale}mm` }}>
            <div
              style={{
                fontSize: `${6.5 * scale}pt`,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: `${P.ink}80`,
                marginBottom: `${2 * scale}mm`,
              }}
            >
              Sådan gør I
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {(print.steps ?? []).map((s, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `${8 * scale}mm 1fr`,
                    alignItems: "baseline",
                    columnGap: `${2 * scale}mm`,
                    padding: `${1.6 * scale}mm 0`,
                    borderTop:
                      i === 0
                        ? `0.25mm solid ${P.ink}22`
                        : `0.25mm solid ${P.ink}12`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: `${14 * scale}pt`,
                      color: P.clay,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontSize: `${10 * scale}pt`,
                      lineHeight: 1.35,
                      color: P.ink,
                    }}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ flex: 1 }} />

          {/* Se efter / Pause hvis — som subtile typografiske linjer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${1.5 * scale}mm`,
              borderTop: `0.25mm solid ${P.ink}22`,
              paddingTop: `${2.5 * scale}mm`,
            }}
          >
            {print.look_for && (
              <SupportLine scale={scale} label="Se efter" tone={P.sage}>
                {print.look_for}
              </SupportLine>
            )}
            {print.pause_if && (
              <SupportLine scale={scale} label="Pause hvis" tone={P.sand}>
                {print.pause_if}
              </SupportLine>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportLine({
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
    <div style={{ display: "grid", gridTemplateColumns: `${20 * scale}mm 1fr`, columnGap: `${2 * scale}mm` }}>
      <div
        style={{
          fontSize: `${6.5 * scale}pt`,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: `${P.ink}80`,
          paddingTop: `${0.6 * scale}mm`,
          position: "relative",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: `${1.6 * scale}mm`,
            height: `${1.6 * scale}mm`,
            borderRadius: "999px",
            background: tone,
            marginRight: `${1.4 * scale}mm`,
            verticalAlign: "middle",
          }}
        />
        {label}
      </div>
      <div style={{ fontSize: `${8.5 * scale}pt`, color: `${P.ink}CC`, lineHeight: 1.35 }}>{children}</div>
    </div>
  );
}
