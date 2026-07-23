import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AGE_GROUPS, AGE_LABELS, type AgeGroup } from "@/lib/card-schema";

export const Route = createFileRoute("/_authenticated/balance")({
  head: () => ({ meta: [{ title: "Projektbalance — Babykort" }] }),
  component: BalancePage,
});

function BalancePage() {
  const { data: cards } = useQuery({
    queryKey: ["balance-cards"],
    queryFn: async () => (await supabase.from("cards").select("*")).data ?? [],
  });

  const list = cards ?? [];
  const perAge = AGE_GROUPS.map((a) => ({ a, n: list.filter((c) => c.age_group === a).length }));
  const perArea: Record<string, number> = {};
  list.forEach((c) => { if (c.primary_development_area) perArea[c.primary_development_area] = (perArea[c.primary_development_area] ?? 0) + 1; });

  const materials: Record<string, number> = {};
  list.forEach((c) => (c.materials as string[] ?? []).forEach((m) => { materials[m] = (materials[m] ?? 0) + 1; }));
  const topMat = Object.entries(materials).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const activeAreas = ["Grovmotorik", "Aktiv leg", "Koordination", "Vestibulær sans"];
  const calmAreas = ["Rolig stimulering", "Tilknytning", "Berøring", "Søvn"];
  const active = list.filter((c) => activeAreas.includes(c.primary_development_area)).length;
  const calm = list.filter((c) => calmAreas.includes(c.primary_development_area)).length;
  const total = list.length || 1;

  const recs: string[] = [];
  perAge.forEach(({ a, n }) => { if (n < 4) recs.push(`Der mangler kort i ${AGE_LABELS[a as AgeGroup]} (kun ${n}).`); });
  Object.entries(perArea).forEach(([area, n]) => { if (n >= 6) recs.push(`Overvægt af ${area} (${n} kort). Overvej variation.`); });
  if (topMat[0] && topMat[0][1] >= 5) recs.push(`"${topMat[0][0]}" indgår i mange kort (${topMat[0][1]}). Overvej flere aktiviteter uden materialer.`);
  if (active > calm * 2) recs.push("Overvægt af aktive aktiviteter — overvej flere rolige.");
  if (calm > active * 2) recs.push("Overvægt af rolige aktiviteter — overvej flere aktive.");

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="font-serif text-4xl">Projektbalance</h1>
        <p className="text-muted-foreground mt-1">Analyse af fordeling og forslag til et balanceret sæt.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Panel title="Aldersfordeling">
          {perAge.map(({ a, n }, i) => (
            <Bar key={a} label={AGE_LABELS[a as AgeGroup]} n={n} max={Math.max(1, ...perAge.map((x) => x.n))} color={`var(--color-age-${i + 1})`} />
          ))}
        </Panel>
        <Panel title="Aktive vs. rolige">
          <Bar label="Aktive aktiviteter" n={active} max={total} color="var(--color-clay)" />
          <Bar label="Rolige aktiviteter" n={calm} max={total} color="var(--color-mist)" />
          <Bar label="Øvrige" n={total - active - calm} max={total} color="var(--color-sand)" />
        </Panel>
      </div>

      <Panel title="Udviklingsområder">
        {Object.entries(perArea).sort((a, b) => b[1] - a[1]).map(([k, n]) => (
          <Bar key={k} label={k} n={n} max={Math.max(1, ...Object.values(perArea))} color="var(--color-sage)" />
        ))}
        {Object.keys(perArea).length === 0 && <p className="text-sm text-muted-foreground">Ingen kort endnu.</p>}
      </Panel>

      <Panel title="Mest anvendte materialer">
        {topMat.length === 0 && <p className="text-sm text-muted-foreground">Ingen materialer registreret.</p>}
        {topMat.map(([m, n]) => (
          <Bar key={m} label={m} n={n} max={topMat[0]?.[1] ?? 1} color="var(--color-butter)" />
        ))}
      </Panel>

      <Panel title="Anbefalinger">
        {recs.length === 0
          ? <p className="text-sm text-muted-foreground">Fordelingen ser afbalanceret ud. Bliv ved.</p>
          : <ul className="space-y-1.5 text-sm">{recs.map((r, i) => <li key={i}>• {r}</li>)}</ul>}
      </Panel>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="font-serif text-xl mb-4">{title}</h2>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Bar({ label, n, max, color }: { label: string; n: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1"><span>{label}</span><span className="text-muted-foreground">{n}</span></div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${(n / Math.max(1, max)) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
