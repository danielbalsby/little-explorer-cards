import { CARD_FORMAT } from "@/lib/card-format";
import { AGE_LABELS, AGE_TOKEN, type PrintContent, type AgeGroup } from "@/lib/card-schema";
import { Circle } from "lucide-react";

interface CardFrontProps {
  print: Partial<PrintContent>;
  /** Vis trim/bleed/safe-area hjælpelinjer */
  guides?: boolean;
  /** Skala på skærmen (1 = 1mm ≈ 3.78px ved 96dpi) */
  scale?: number;
  className?: string;
}

/**
 * Fysisk forside — læser dimensioner fra card-format.ts.
 * Bruger mm-enheder direkte, så preview matcher trykkeklar størrelse.
 */
export function CardFront({ print, guides = false, scale = 1, className = "" }: CardFrontProps) {
  const { trim, bleed, safe, cornerRadius } = CARD_FORMAT;
  const token = print.age_group ? AGE_TOKEN[print.age_group as AgeGroup] : "sand";
  const ageLabel = print.age_group ? AGE_LABELS[print.age_group as AgeGroup] : "";

  const bleedStyle: React.CSSProperties = {
    width: `${(trim.width + bleed * 2) * scale}mm`,
    height: `${(trim.height + bleed * 2) * scale}mm`,
    padding: `${bleed * scale}mm`,
    position: "relative",
  };
  const trimStyle: React.CSSProperties = {
    width: `${trim.width * scale}mm`,
    height: `${trim.height * scale}mm`,
    padding: `${safe * scale}mm`,
    borderRadius: `${cornerRadius * scale}mm`,
    background: "var(--color-card)",
    boxShadow: guides ? "none" : "var(--shadow-card)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div className={"card-front bg-transparent " + className} style={bleedStyle}>
      {guides && <BleedGuides />}
      <div style={trimStyle}>
        {/* Diskret aldersfarve som blødt accent-bånd i toppen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, color-mix(in oklab, var(--color-${token}) 55%, transparent) 0mm, transparent ${18 * scale}mm)`,
            pointerEvents: "none",
          }}
        />

        {guides && <SafeGuides />}

        <div className="relative flex flex-col h-full" style={{ gap: `${2 * scale}mm` }}>
          {/* Header: titel + alder + områdeikoner */}
          <header className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2
                className="font-serif leading-tight text-foreground"
                style={{ fontSize: `${14 * scale}pt`, letterSpacing: "-0.01em" }}
              >
                {print.title || "Uden titel"}
              </h2>
              <div
                className="text-muted-foreground mt-0.5"
                style={{ fontSize: `${8 * scale}pt` }}
              >
                {ageLabel}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {(print.development_areas ?? []).slice(0, 3).map((_, i) => (
                <Circle
                  key={i}
                  fill={`var(--color-${token})`}
                  strokeWidth={0}
                  style={{ width: `${2.4 * scale}mm`, height: `${2.4 * scale}mm`, opacity: 0.85 }}
                />
              ))}
            </div>
          </header>

          {/* Intro */}
          {print.intro && (
            <p
              className="text-foreground/80 leading-snug"
              style={{ fontSize: `${9.5 * scale}pt` }}
            >
              {print.intro}
            </p>
          )}

          {/* Områder som chips */}
          {(print.development_areas?.length ?? 0) > 0 && (
            <div className="flex flex-wrap" style={{ gap: `${1.2 * scale}mm` }}>
              {print.development_areas?.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center rounded-full text-foreground/70"
                  style={{
                    fontSize: `${7 * scale}pt`,
                    padding: `${0.6 * scale}mm ${1.8 * scale}mm`,
                    background: `color-mix(in oklab, var(--color-${token}) 30%, transparent)`,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* Materialer — meget subtil linje */}
          {print.materials && (
            <div
              className="flex items-baseline gap-2"
              style={{ fontSize: `${8.5 * scale}pt` }}
            >
              <span className="uppercase tracking-widest text-muted-foreground" style={{ fontSize: `${6.5 * scale}pt` }}>
                Materialer
              </span>
              <span>{print.materials}</span>
            </div>
          )}

          {/* Sådan gør I — vigtigste sektion */}
          {(print.steps?.length ?? 0) > 0 && (
            <div>
              <div
                className="uppercase tracking-widest text-muted-foreground mb-1"
                style={{ fontSize: `${6.5 * scale}pt` }}
              >
                Sådan gør I
              </div>
              <ol className="space-y-0.5" style={{ fontSize: `${9.5 * scale}pt`, lineHeight: 1.35 }}>
                {print.steps?.map((s, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-muted-foreground tabular-nums">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Spacer skubber bunden ned */}
          <div className="flex-1" />

          {/* Bund-sektioner: kompakt, med labels som små caps */}
          <div className="space-y-1.5" style={{ fontSize: `${8.5 * scale}pt`, lineHeight: 1.35 }}>
            {(print.variations?.length ?? 0) > 0 && (
              <BottomRow scale={scale} label="Prøv også">
                {print.variations?.join(" · ")}
              </BottomRow>
            )}
            {print.look_for && (
              <BottomRow scale={scale} label="Se efter">{print.look_for}</BottomRow>
            )}
            {print.pause_if && (
              <BottomRow scale={scale} label="Pause hvis">{print.pause_if}</BottomRow>
            )}
            {print.safety && (
              <BottomRow scale={scale} label="Sikkerhed">{print.safety}</BottomRow>
            )}
            {print.did_you_know && (
              <div
                className="rounded-md"
                style={{
                  fontSize: `${8 * scale}pt`,
                  padding: `${1.5 * scale}mm ${2 * scale}mm`,
                  background: "color-mix(in oklab, var(--color-butter) 35%, transparent)",
                }}
              >
                <span className="uppercase tracking-widest text-muted-foreground mr-1" style={{ fontSize: `${6.5 * scale}pt` }}>
                  Vidste du?
                </span>
                {print.did_you_know}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomRow({ label, children, scale }: { label: string; children: React.ReactNode; scale: number }) {
  return (
    <div className="flex gap-2">
      <div
        className="uppercase tracking-widest text-muted-foreground shrink-0"
        style={{ fontSize: `${6.5 * scale}pt`, width: `${18 * scale}mm`, paddingTop: `${0.5 * scale}mm` }}
      >
        {label}
      </div>
      <div className="text-foreground/85">{children}</div>
    </div>
  );
}

function BleedGuides() {
  const { trim, bleed } = CARD_FORMAT;
  return (
    <>
      {/* Trim outline (dashed) */}
      <div
        className="pointer-events-none absolute border border-dashed"
        style={{
          top: `${bleed}mm`,
          left: `${bleed}mm`,
          width: `${trim.width}mm`,
          height: `${trim.height}mm`,
          borderColor: "color-mix(in oklab, var(--color-destructive) 40%, transparent)",
        }}
      />
    </>
  );
}

function SafeGuides() {
  const { safe } = CARD_FORMAT;
  return (
    <div
      className="pointer-events-none absolute border border-dashed"
      style={{
        top: `${safe}mm`,
        left: `${safe}mm`,
        right: `${safe}mm`,
        bottom: `${safe}mm`,
        borderColor: "color-mix(in oklab, var(--color-primary) 45%, transparent)",
      }}
    />
  );
}
