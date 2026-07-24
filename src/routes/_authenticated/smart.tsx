import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AGE_GROUPS, AGE_LABELS, type AgeGroup, type SmartGeneratedCard } from "@/lib/card-schema";
import { generateSmartCard, saveCard, critiqueCard, analyzeProjectBalance } from "@/lib/cards.functions";
import { PARENT_CATEGORIES, PARENT_CATEGORY_ICON, PARENT_CATEGORY_DESCRIPTION, type ParentCategory } from "@/lib/parent-categories";
import { CAREGIVER_ENERGY, CAREGIVER_ENERGY_LABEL, SETUP_LEVELS, SETUP_LEVEL_LABEL, GOOD_WHEN_TAGS, GOOD_WHEN_LABEL, type CaregiverEnergy, type SetupLevel } from "@/lib/caregiver-context";
import { MECHANIC_LABEL, type ActivityMechanic } from "@/lib/activity-mechanics";
import { CardFront } from "@/components/card-front";
import { CardBack } from "@/components/card-back";
import { countPrintWords, fitStatus } from "@/lib/card-text";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, Loader2, Save, Wand2, AlertTriangle, ShieldAlert, Info, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/smart")({
  head: () => ({ meta: [{ title: "Smart generator — Babykort" }] }),
  component: SmartPage,
});

function SmartPage() {
  const navigate = useNavigate();
  const gen = useServerFn(generateSmartCard);
  const save = useServerFn(saveCard);
  const crit = useServerFn(critiqueCard);
  const bal = useServerFn(analyzeProjectBalance);

  const { data: balance } = useQuery({
    queryKey: ["project-balance"],
    queryFn: () => bal(),
  });

  const [age, setAge] = useState<AgeGroup>("2-4m");
  const [parentCat, setParentCat] = useState<ParentCategory | "">("");
  const [energy, setEnergy] = useState<CaregiverEnergy>("ok");
  const [setup, setSetup] = useState<SetupLevel>("ingen");
  const [goodWhen, setGoodWhen] = useState<string[]>([]);
  const [extra, setExtra] = useState("");

  const [result, setResult] = useState<Awaited<ReturnType<typeof gen>> | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const [score, setScore] = useState<Awaited<ReturnType<typeof crit>> | null>(null);

  const preview: SmartGeneratedCard | null = result?.ok ? result.card : null;
  const wordCount = preview ? countPrintWords(preview.print) : 0;
  const status = fitStatus(wordCount);

  const generateM = useMutation({
    mutationFn: () => gen({ data: {
      age_group: age,
      parent_category: parentCat || undefined,
      caregiver_energy: energy,
      setup_level: setup,
      good_when: goodWhen,
      extra_instruction: extra,
      avoid_mechanics: [],
    } }),
    onSuccess: (res) => {
      setResult(res);
      setScore(null);
      if (!res.ok) { toast.error(res.error); return; }
      if (res.similar.length > 0) {
        toast.warning(`Ligner mekanik i ${res.similar.length} eksisterende kort.`);
      } else {
        toast.success("Nyt kort klar.");
      }
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const critiqueM = useMutation({
    mutationFn: () => crit({ data: { print: preview!.print } }),
    onSuccess: (r) => { setScore(r); if (!r.ok) toast.error(r.error); },
  });

  const saveM = useMutation({
    mutationFn: (status: "draft" | "approved") => save({ data: {
      print: preview!.print,
      extended: preview!.extended,
      illustration_prompt: preview!.illustration_prompt,
      activity_type: preview!.activity_type,
      duration: preview!.duration,
      primary_development_area: preview!.primary_development_area,
      secondary_development_areas: preview!.secondary_development_areas,
      parent_category: preview!.parent_category,
      activity_mechanics: preview!.activity_mechanics,
      caregiver_energy: preview!.caregiver_energy,
      setup_level: preview!.setup_level,
      good_when: preview!.good_when,
      generation_rationale: preview!.generation_rationale,
      fact_statement: preview!.fact_statement,
      evidence_level: preview!.evidence_level,
      quality_score: score?.ok ? score.score : undefined,
      status,
    } }),
    onSuccess: (card) => {
      toast.success("Kort gemt.");
      navigate({ to: "/kort/$id", params: { id: card.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const toggleGoodWhen = (t: string) =>
    setGoodWhen((g) => g.includes(t) ? g.filter((x) => x !== t) : [...g, t]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
          <Wand2 className="h-3.5 w-3.5" /> Intelligent generator
        </div>
        <h1 className="font-serif text-4xl">Skab et kort der passer nu</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Vælg hvor barnet og du er lige nu. Generatoren tager også hensyn til hvad projektet allerede har for meget af.
        </p>
      </header>

      {balance && balance.gaps.length > 0 && (
        <div className="rounded-2xl border bg-[color:var(--color-butter)]/25 p-4 text-sm">
          <div className="font-medium mb-1 inline-flex items-center gap-1.5">
            <Info className="h-4 w-4" /> Projektet mangler
          </div>
          <div className="text-foreground/80">{balance.gaps.join(" · ")}</div>
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8">
        {/* Left: intent-panel */}
        <section className="space-y-6 rounded-3xl border bg-card p-6">
          <Group label="Aldersgruppe">
            <div className="flex flex-wrap gap-1.5">
              {AGE_GROUPS.map((a) => (
                <Chip key={a} active={age === a} onClick={() => setAge(a)}>{AGE_LABELS[a]}</Chip>
              ))}
            </div>
          </Group>

          <Group label="Situation" hint="Hvor er I i dag?">
            <div className="grid grid-cols-2 gap-2">
              <Chip active={parentCat === ""} onClick={() => setParentCat("")}>AI vælger</Chip>
              {PARENT_CATEGORIES.map((c) => (
                <Chip key={c} active={parentCat === c} onClick={() => setParentCat(c)}>
                  <span className="mr-1.5">{PARENT_CATEGORY_ICON[c]}</span>{c}
                </Chip>
              ))}
            </div>
            {parentCat && (
              <p className="text-xs text-muted-foreground mt-2">{PARENT_CATEGORY_DESCRIPTION[parentCat]}</p>
            )}
          </Group>

          <div className="grid grid-cols-2 gap-4">
            <Group label="Din energi lige nu">
              <div className="flex gap-1.5">
                {CAREGIVER_ENERGY.map((e) => (
                  <Chip key={e} active={energy === e} onClick={() => setEnergy(e)}>{CAREGIVER_ENERGY_LABEL[e]}</Chip>
                ))}
              </div>
            </Group>
            <Group label="Forberedelse">
              <div className="flex gap-1.5">
                {SETUP_LEVELS.map((s) => (
                  <Chip key={s} active={setup === s} onClick={() => setSetup(s)}>{SETUP_LEVEL_LABEL[s]}</Chip>
                ))}
              </div>
            </Group>
          </div>

          <Group label="Særligt godt til" hint="Vælg gerne 0-3">
            <div className="flex flex-wrap gap-1.5">
              {GOOD_WHEN_TAGS.map((t) => (
                <Chip key={t} active={goodWhen.includes(t)} onClick={() => toggleGoodWhen(t)}>
                  {GOOD_WHEN_LABEL[t]}
                </Chip>
              ))}
            </div>
          </Group>

          <Group label="Ekstra ønske">
            <Textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="fx: uden legetøj, kun stemme og hænder" />
          </Group>

          <Button size="lg" className="w-full h-12" onClick={() => generateM.mutate()} disabled={generateM.isPending}>
            {generateM.isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Skaber kortet…</>
              : <><Sparkles className="mr-2 h-4 w-4" /> Skab kort</>}
          </Button>
        </section>

        {/* Right: preview & metadata */}
        <section className="space-y-4">
          {preview ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="flex rounded-md border overflow-hidden text-sm">
                  {(["front", "back"] as const).map((s) => (
                    <button key={s} onClick={() => setSide(s)} className={"px-3 py-1.5 " + (side === s ? "bg-muted" : "hover:bg-muted/50")}>
                      {s === "front" ? "Forside" : "Bagside"}
                    </button>
                  ))}
                </div>
                <StatusPill status={status} count={wordCount} />
              </div>

              <div className="flex justify-center">
                {side === "front"
                  ? <CardFront print={preview.print} />
                  : <CardBack title={preview.print.title} age_group={preview.print.age_group} illustration_status="not_generated" seed={preview.print.title.length} />}
              </div>

              {/* Metadata-kort */}
              <div className="rounded-2xl border bg-card p-4 text-sm space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  <MetaTag>{PARENT_CATEGORY_ICON[preview.parent_category as ParentCategory] ?? "•"} {preview.parent_category}</MetaTag>
                  <MetaTag>Energi: {preview.caregiver_energy}</MetaTag>
                  <MetaTag>Setup: {preview.setup_level}</MetaTag>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Mekanik</div>
                  <div className="flex flex-wrap gap-1">
                    {preview.activity_mechanics.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-muted">
                        {MECHANIC_LABEL[m as ActivityMechanic] ?? m}
                      </span>
                    ))}
                  </div>
                </div>
                {preview.generation_rationale && (
                  <div className="text-xs text-muted-foreground italic">"{preview.generation_rationale}"</div>
                )}
                {preview.fact_statement && (
                  <div className="text-xs rounded-md bg-muted/50 p-2">
                    <span className="font-medium">Fakta ({preview.evidence_level || "ukendt"}): </span>
                    {preview.fact_statement}
                  </div>
                )}
              </div>

              {/* Similarity på mekanik */}
              {result?.ok && result.similar.length > 0 && (
                <div className="rounded-xl border bg-[color:var(--color-butter)]/40 p-3 text-sm">
                  <div className="font-medium mb-1 inline-flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Ligner mekanik i:
                  </div>
                  <ul className="text-xs space-y-0.5">
                    {result.similar.map((s) => (
                      <li key={s.id}>#{s.card_number} · {s.title} <span className="text-muted-foreground">({Math.round(s.mechanic_overlap * 100)}%)</span></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety attachments */}
              {result?.ok && result.safetyAttachments.length > 0 && (
                <div className="rounded-xl border bg-destructive/5 p-3 text-sm">
                  <div className="font-medium mb-1 inline-flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" /> Sikkerhedsregler vedhæftes ved print
                  </div>
                  <ul className="text-xs space-y-0.5">
                    {result.safetyAttachments.map((s) => (
                      <li key={s.trigger}>• {s.category} — {s.trigger}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Critique */}
              {score?.ok && (
                <div className="rounded-xl border bg-card p-3 text-sm">
                  <div className="font-medium mb-2 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Kvalitetsscore {score.score.overall}/5
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-[10px] text-center mb-2">
                    <ScoreBar label="Nærvær" v={score.score.presence} />
                    <ScoreBar label="Klarhed" v={score.score.clarity} />
                    <ScoreBar label="Varme" v={score.score.warmth} />
                    <ScoreBar label="Original" v={score.score.originality} />
                    <ScoreBar label="Sikker" v={score.score.safety} />
                  </div>
                  <p className="text-xs text-muted-foreground">{score.score.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" onClick={() => generateM.mutate()} disabled={generateM.isPending}>Ny version</Button>
                <Button variant="outline" onClick={() => critiqueM.mutate()} disabled={critiqueM.isPending}>
                  {critiqueM.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                  Kvalitetstjek
                </Button>
                <Button variant="outline" onClick={() => saveM.mutate("draft")} disabled={saveM.isPending}>
                  <Save className="mr-1.5 h-4 w-4" /> Gem som udkast
                </Button>
                <Button onClick={() => saveM.mutate("approved")} disabled={saveM.isPending}>Godkend & gem</Button>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border-2 border-dashed p-10 text-center text-muted-foreground min-h-[500px] grid place-items-center">
              <div>
                <Wand2 className="h-8 w-8 mx-auto mb-3 opacity-40" />
                Vælg situation og tryk "Skab kort".
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Group({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={"px-3 py-1.5 rounded-full text-xs border transition-colors text-left " +
        (active ? "bg-primary/15 border-primary/40" : "bg-background hover:bg-muted border-border")}>
      {children}
    </button>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
  return <span className="text-xs px-2 py-0.5 rounded-full bg-muted border">{children}</span>;
}

function StatusPill({ status, count }: { status: "ok" | "warn" | "over"; count: number }) {
  const cls = status === "ok" ? "bg-[color:var(--color-sage)]/25"
    : status === "warn" ? "bg-[color:var(--color-butter)]/50"
    : "bg-destructive/20";
  return <div className={"text-xs px-2.5 py-1 rounded-full " + cls}>{count} ord {status === "over" ? "· for langt" : status === "warn" ? "· tæt på max" : "· passer"}</div>;
}

function ScoreBar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full" style={{ width: `${(v / 5) * 100}%`, background: v >= 4 ? "var(--color-sage)" : v >= 3 ? "var(--color-butter)" : "var(--color-clay)" }} />
      </div>
      <div className="mt-1 text-muted-foreground">{label}</div>
      <div className="font-medium">{v}</div>
    </div>
  );
}
