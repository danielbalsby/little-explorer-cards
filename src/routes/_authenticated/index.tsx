import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { AGE_GROUPS, AGE_LABELS, STATUS_LABEL, type AgeGroup } from "@/lib/card-schema";
import { analyzeSeriesStrength } from "@/lib/cards.functions";
import { Progress } from "@/components/ui/progress";
import { Sparkles, AlertTriangle, Gauge } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

function Dashboard() {
  const seriesFn = useServerFn(analyzeSeriesStrength);
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [{ data: cards }, { data: settings }] = await Promise.all([
        supabase.from("cards").select("id, title, age_group, primary_development_area, status, updated_at").order("updated_at", { ascending: false }),
        supabase.from("project_settings").select("target_card_count").maybeSingle(),
      ]);
      return { cards: cards ?? [], target: settings?.target_card_count ?? 120 };
    },
  });
  const { data: series } = useQuery({
    queryKey: ["series-strength"],
    queryFn: () => seriesFn(),
  });

  const cards = data?.cards ?? [];
  const target = data?.target ?? 120;
  const total = cards.length;
  const approved = cards.filter((c) => c.status === "approved").length;
  const draft = cards.filter((c) => c.status === "draft").length;
  const rejected = cards.filter((c) => c.status === "rejected").length;

  const perAge = AGE_GROUPS.map((a) => ({ age: a, count: cards.filter((c) => c.age_group === a).length }));
  const perArea = Object.entries(cards.reduce<Record<string, number>>((acc, c) => {
    if (c.primary_development_area) acc[c.primary_development_area] = (acc[c.primary_development_area] ?? 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const warnings: string[] = [];
  perAge.forEach((p) => { if (p.count < 4) warnings.push(`Få kort i ${AGE_LABELS[p.age]} (${p.count}).`); });
  perArea.forEach(([area, n]) => { if (n >= 6) warnings.push(`Mange kort med fokus på ${area} (${n}).`); });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-4xl">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overblik over projektets aktivitetskort.</p>
        </div>
        <Link to="/generer" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Sparkles className="h-4 w-4" /> Generér nyt kort
        </Link>
      </header>

      <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-sm text-muted-foreground">Fremdrift mod {target} kort</div>
            <div className="font-serif text-3xl mt-1">{total} <span className="text-lg text-muted-foreground">/ {target}</span></div>
          </div>
          <div className="text-sm text-muted-foreground">{Math.round((total / target) * 100)}%</div>
        </div>
        <Progress value={(total / target) * 100} />
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Alle kort" value={total} />
        <Stat label={STATUS_LABEL.approved} value={approved} tone="sage" />
        <Stat label={STATUS_LABEL.draft} value={draft} tone="sand" />
        <Stat label={STATUS_LABEL.rejected} value={rejected} tone="clay" />
      </div>

      {series && (
        <section className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="h-4 w-4" />
            <h2 className="font-serif text-xl">Seriestyrke</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <SeriesStat label="Gennemsnitlig kvalitet" value={series.avgQuality !== null ? `${series.avgQuality}/5` : "—"} />
            <SeriesStat label="Fortjener plads" value={series.byDeserves.ja ?? 0} tone="sage" />
            <SeriesStat label="Kan reddes" value={series.byDeserves["måske"] ?? 0} tone="sand" />
            <SeriesStat label="Bør droppes" value={series.byDeserves.nej ?? 0} tone="clay" />
            <SeriesStat label="Kandidater" value={series.byStatus.candidate ?? 0} />
          </div>
        </section>
      )}


      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-serif text-xl mb-4">Fordeling pr. aldersgruppe</h2>
          <div className="space-y-2.5">
            {perAge.map((p) => (
              <BarRow key={p.age} label={AGE_LABELS[p.age as AgeGroup]} value={p.count} max={Math.max(1, ...perAge.map((x) => x.count))} tokenVar={`--color-${(["age-1","age-2","age-3","age-4","age-5"] as const)[AGE_GROUPS.indexOf(p.age)]}`} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-serif text-xl mb-4">Top udviklingsområder</h2>
          <div className="space-y-2.5">
            {perArea.length === 0 && <p className="text-sm text-muted-foreground">Ingen kort endnu.</p>}
            {perArea.map(([area, n]) => (
              <BarRow key={area} label={area} value={n} max={Math.max(1, ...perArea.map((x) => x[1]))} tokenVar="--color-sage" />
            ))}
          </div>
        </section>
      </div>

      {warnings.length > 0 && (
        <section className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-[color:var(--color-clay)]" />
            <h2 className="font-serif text-xl">Advarsler</h2>
          </div>
          <ul className="space-y-1.5 text-sm">
            {warnings.map((w, i) => <li key={i} className="text-foreground/80">• {w}</li>)}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-serif text-xl mb-4">Senest redigerede kort</h2>
        <ul className="divide-y">
          {cards.slice(0, 6).map((c) => (
            <li key={c.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Link to="/kort/$id" params={{ id: c.id }} className="font-medium hover:underline">{c.title}</Link>
                <div className="text-xs text-muted-foreground">{AGE_LABELS[c.age_group as AgeGroup]} · {c.primary_development_area}</div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">{STATUS_LABEL[c.status as keyof typeof STATUS_LABEL]}</span>
            </li>
          ))}
          {cards.length === 0 && <li className="py-6 text-sm text-muted-foreground text-center">Ingen kort endnu.</li>}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "sage" | "sand" | "clay" }) {
  const bg = tone === "sage" ? "var(--color-sage)" : tone === "sand" ? "var(--color-sand)" : tone === "clay" ? "var(--color-clay)" : "var(--color-muted)";
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
      <div className="flex items-baseline gap-2 mt-2">
        <div className="font-serif text-3xl">{value}</div>
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: bg }} />
      </div>
    </div>
  );
}

function BarRow({ label, value, max, tokenVar }: { label: string; value: number; max: number; tokenVar: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span><span className="text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: `var(${tokenVar})` }} />
      </div>
    </div>
  );
}

function SeriesStat({ label, value, tone }: { label: string; value: number | string; tone?: "sage" | "sand" | "clay" }) {
  const bg = tone === "sage" ? "var(--color-sage)" : tone === "sand" ? "var(--color-sand)" : tone === "clay" ? "var(--color-clay)" : "var(--color-muted)";
  return (
    <div className="rounded-xl border p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-2 mt-1">
        <div className="font-serif text-2xl">{value}</div>
        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bg }} />
      </div>
    </div>
  );
}
