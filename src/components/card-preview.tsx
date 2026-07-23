import { AGE_LABELS, AGE_TOKEN, type AgeGroup, type CardContent } from "@/lib/card-schema";

export function CardPreview({ card }: { card: Partial<CardContent> }) {
  const ageToken = card.age_group ? AGE_TOKEN[card.age_group as AgeGroup] : "sand";
  const ageLabel = card.age_group ? AGE_LABELS[card.age_group as AgeGroup] : "Alder ikke valgt";

  return (
    <div className="rounded-3xl bg-card shadow-[var(--shadow-card)] overflow-hidden border">
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: `var(--color-${ageToken})` }}
      >
        <span className="text-xs uppercase tracking-widest text-foreground/70">{ageLabel}</span>
        <span className="text-xs text-foreground/70">{card.activity_type || "—"}</span>
      </div>
      <div className="p-6 space-y-5">
        <h2 className="font-serif text-3xl leading-tight">{card.title || "Ny aktivitet"}</h2>

        {card.purpose && (
          <p className="text-sm leading-relaxed text-foreground/80">{card.purpose}</p>
        )}

        <Section label="Udviklingsområder">
          <div className="flex flex-wrap gap-1.5">
            {card.primary_development_area && (
              <Chip strong>{card.primary_development_area}</Chip>
            )}
            {(card.secondary_development_areas ?? []).map((a) => (
              <Chip key={a}>{a}</Chip>
            ))}
          </div>
        </Section>

        {(card.materials?.length ?? 0) > 0 && (
          <Section label="Materialer">
            <p className="text-sm">{card.materials?.join(", ")}</p>
          </Section>
        )}

        {(card.activity_steps?.length ?? 0) > 0 && (
          <Section label="Aktivitet">
            <ol className="text-sm space-y-1.5 list-decimal list-inside">
              {card.activity_steps?.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </Section>
        )}

        {(card.variations?.length ?? 0) > 0 && (
          <Section label="Variationer">
            <ul className="text-sm space-y-1 list-disc list-inside">
              {card.variations?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </Section>
        )}

        {card.observations && (
          <Section label="Observer barnet">
            <p className="text-sm">{card.observations}</p>
          </Section>
        )}
        {card.pause_signs && (
          <Section label="Tegn på pause">
            <p className="text-sm">{card.pause_signs}</p>
          </Section>
        )}
        {card.safety && (
          <Section label="Sikkerhed">
            <p className="text-sm">{card.safety}</p>
          </Section>
        )}
        {card.did_you_know && (
          <div className="rounded-xl bg-muted/60 p-4 text-sm">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Vidste du?</div>
            {card.did_you_know}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
      {children}
    </div>
  );
}

function Chip({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs " +
        (strong ? "bg-primary/15 text-primary-foreground/90 text-foreground border border-primary/30"
                : "bg-muted text-foreground/70 border")
      }
    >
      {children}
    </span>
  );
}
