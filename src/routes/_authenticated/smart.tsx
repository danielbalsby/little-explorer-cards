import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AGE_GROUPS, AGE_LABELS, FEEDBACK_REASONS, FEEDBACK_REASON_LABEL,
  type AgeGroup, type SmartGeneratedCard, type EditorialReview,
} from "@/lib/card-schema";
import {
  generateSmartCard, saveCard, reviewCard, improveCard,
  submitEditorialFeedback, analyzeProjectBalance,
} from "@/lib/cards.functions";
import { PARENT_CATEGORIES, PARENT_CATEGORY_ICON, PARENT_CATEGORY_DESCRIPTION, type ParentCategory } from "@/lib/parent-categories";
import { CAREGIVER_ENERGY, CAREGIVER_ENERGY_LABEL, SETUP_LEVELS, SETUP_LEVEL_LABEL, GOOD_WHEN_TAGS, GOOD_WHEN_LABEL, type CaregiverEnergy, type SetupLevel } from "@/lib/caregiver-context";
import { MECHANIC_LABEL, type ActivityMechanic } from "@/lib/activity-mechanics";
import { CardFront } from "@/components/card-front";
import { CardBack } from "@/components/card-back";
import { countPrintWords, fitStatus } from "@/lib/card-text";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Sparkles, Loader2, Save, Wand2, AlertTriangle, ShieldAlert,
  Info, CheckCircle2, XCircle, HelpCircle, Gauge, ThumbsUp, Scissors,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/smart")({
  head: () => ({ meta: [{ title: "Smart generator — Babykort" }] }),
  component: SmartPage,
});

function SmartPage() {
  const navigate = useNavigate();
  const gen = useServerFn(generateSmartCard);
  const save = useServerFn(saveCard);
  const review = useServerFn(reviewCard);
  const improve = useServerFn(improveCard);
  const feedback = useServerFn(submitEditorialFeedback);
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
  const [editorial, setEditorial] = useState<EditorialReview | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReasons, setRejectReasons] = useState<string[]>([]);
  const [rejectNote, setRejectNote] = useState("");

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
      setEditorial(null);
      if (!res.ok) { toast.error(res.error); return; }
      if (res.similar.length > 0) toast.warning(`Ligner mekanik i ${res.similar.length} eksisterende kort.`);
      else toast.success("Nyt kort klar.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const reviewM = useMutation({
    mutationFn: () => review({ data: {
      print: preview!.print,
      parent_category: preview!.parent_category,
      activity_mechanics: preview!.activity_mechanics,
    } }),
    onSuccess: (r) => {
      if (!r.ok) { toast.error(r.error); return; }
      setEditorial(r.review);
      const verdict = r.review.deserves_spot;
      if (verdict === "ja") toast.success("Redaktør: Fortjener en plads.");
      else if (verdict === "nej") toast.error("Redaktør: Fortjener ikke en plads.");
      else toast.warning("Redaktør: Kan reddes med rettelser.");
    },
  });

  const improveM = useMutation({
    mutationFn: (focus: string) => improve({ data: {
      print: preview!.print,
      focus,
      weaknesses: editorial?.score.weaknesses ?? [],
    } }),
    onSuccess: (r) => {
      if (!r.ok) { toast.error(r.error); return; }
      if (result?.ok) {
        setResult({ ...result, card: { ...result.card, print: r.print } });
        setEditorial(null);
        toast.success("Kort forbedret. Kør nyt review.");
      }
    },
  });

  const saveM = useMutation({
    mutationFn: (saveStatus: "draft" | "candidate" | "approved") => save({ data: {
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
      quality_score: editorial?.score ?? undefined,
      deserves_spot: editorial?.deserves_spot,
      editorial_verdict: editorial?.editorial_verdict,
      status: saveStatus,
    } }),
    onSuccess: async (card) => {
      await feedback({ data: {
        card_id: card.id,
        feedback_type: "approve",
        feedback_reasons: [],
        action_taken: `saved_as_${card.status}`,
      } }).catch(() => {});
      toast.success("Kort gemt.");
      navigate({ to: "/kort/$id", params: { id: card.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const rejectM = useMutation({
    mutationFn: async () => {
      await feedback({ data: {
        feedback_type: "reject",
        feedback_reasons: rejectReasons,
        feedback_note: rejectNote,
        action_taken: "discarded_before_save",
      } });
    },
    onSuccess: () => {
      toast.success("Feedback logget. Ny variation kan skabes.");
      setRejectOpen(false);
      setRejectReasons([]);
      setRejectNote("");
      setResult(null);
      setEditorial(null);
    },
  });

  const toggleGoodWhen = (t: string) =>
    setGoodWhen((g) => g.includes(t) ? g.filter((x) => x !== t) : [...g, t]);
  const toggleReason = (r: string) =>
    setRejectReasons((rs) => rs.includes(r) ? rs.filter((x) => x !== r) : [...rs, r]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
          <Wand2 className="h-3.5 w-3.5" /> Intelligent generator med redaktør
        </div>
        <h1 className="font-serif text-4xl">Skab et kort der fortjener en plads</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Generér, lad redaktøren bedømme, forbedr eller afvis. Målet: 120 stærke kort — ikke 120 middelmådige.
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
              <div className="flex gap-1.5 flex-wrap">
                {CAREGIVER_ENERGY.map((e) => (
                  <Chip key={e} active={energy === e} onClick={() => setEnergy(e)}>{CAREGIVER_ENERGY_LABEL[e]}</Chip>
                ))}
              </div>
            </Group>
            <Group label="Forberedelse">
              <div className="flex gap-1.5 flex-wrap">
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

        {/* Right: preview & editorial */}
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
                  : <CardBack />}
              </div>

              {/* Metadata */}
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
              </div>

              {/* Similarity */}
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

              {/* Safety */}
              {result?.ok && result.safetyAttachments.length > 0 && (
                <div className="rounded-xl border bg-destructive/5 p-3 text-sm">
                  <div className="font-medium mb-1 inline-flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" /> Sikkerhedsregler vedhæftes
                  </div>
                  <ul className="text-xs space-y-0.5">
                    {result.safetyAttachments.map((s) => (
                      <li key={s.trigger}>• {s.category} — {s.trigger}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Editorial review panel */}
              {editorial ? (
                <EditorialPanel
                  editorial={editorial}
                  improving={improveM.isPending}
                  onImprove={(focus) => improveM.mutate(focus)}
                />
              ) : (
                <div className="rounded-2xl border-2 border-dashed p-4 text-sm text-center">
                  <Gauge className="h-5 w-5 mx-auto mb-2 opacity-60" />
                  <p className="mb-2 text-muted-foreground">Lad redaktøren bedømme kortet på 10 dimensioner.</p>
                  <Button variant="outline" onClick={() => reviewM.mutate()} disabled={reviewM.isPending}>
                    {reviewM.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                    Kør redaktør-review
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" onClick={() => generateM.mutate()} disabled={generateM.isPending}>Ny variation</Button>
                <Button variant="outline" onClick={() => setRejectOpen(true)}>
                  <XCircle className="mr-1.5 h-4 w-4" /> Afvis
                </Button>
                <Button variant="outline" onClick={() => saveM.mutate("draft")} disabled={saveM.isPending}>
                  <Save className="mr-1.5 h-4 w-4" /> Gem udkast
                </Button>
                <Button variant="outline" onClick={() => saveM.mutate("candidate")} disabled={saveM.isPending}>
                  Send til kandidater
                </Button>
                <Button onClick={() => saveM.mutate("approved")} disabled={saveM.isPending}>
                  <ThumbsUp className="mr-1.5 h-4 w-4" /> Godkend
                </Button>
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

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hvorfor afviser du kortet?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {FEEDBACK_REASONS.map((r) => (
                <Chip key={r} active={rejectReasons.includes(r)} onClick={() => toggleReason(r)}>
                  {FEEDBACK_REASON_LABEL[r]}
                </Chip>
              ))}
            </div>
            <Textarea rows={3} placeholder="Ekstra note (valgfri)" value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Fortryd</Button>
            <Button onClick={() => rejectM.mutate()} disabled={rejectM.isPending || rejectReasons.length === 0}>
              Log og forkast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditorialPanel({
  editorial, improving, onImprove,
}: { editorial: EditorialReview; improving: boolean; onImprove: (focus: string) => void }) {
  const v = editorial.deserves_spot;
  const badge = v === "ja"
    ? { icon: <CheckCircle2 className="h-4 w-4" />, cls: "bg-[color:var(--color-sage)]/30", label: "Fortjener en plads" }
    : v === "nej"
      ? { icon: <XCircle className="h-4 w-4" />, cls: "bg-destructive/20", label: "Bør droppes" }
      : { icon: <HelpCircle className="h-4 w-4" />, cls: "bg-[color:var(--color-butter)]/60", label: "Kan reddes" };

  const dims: Array<[string, keyof EditorialReview["score"]]> = [
    ["Nærvær", "presence"], ["Klarhed", "clarity"], ["Varme", "warmth"],
    ["Original", "originality"], ["Sikker", "safety"], ["Alder", "age_fit"],
    ["Ingen pres", "no_performance_pressure"], ["Handling", "actionable"],
    ["Print-fit", "print_fit"], ["Sprog", "parent_language"],
  ];

  return (
    <div className="rounded-2xl border bg-card p-4 space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <div className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs " + badge.cls}>
          {badge.icon} {badge.label}
        </div>
        <div className="text-xs text-muted-foreground">Score {editorial.score.overall}/5</div>
      </div>

      <p className="italic">"{editorial.editorial_verdict}"</p>

      <div className="grid grid-cols-5 gap-1.5">
        {dims.map(([label, key]) => (
          <ScoreBar key={key} label={label} v={editorial.score[key] as number} />
        ))}
      </div>

      {editorial.score.strengths.length > 0 && (
        <div className="text-xs">
          <span className="text-muted-foreground">Styrker: </span>{editorial.score.strengths.join(" · ")}
        </div>
      )}
      {editorial.score.weaknesses.length > 0 && (
        <div className="text-xs">
          <span className="text-muted-foreground">Svagheder: </span>{editorial.score.weaknesses.join(" · ")}
        </div>
      )}

      {editorial.suggested_improvements.length > 0 && v !== "nej" && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Foreslåede rettelser</div>
          {editorial.suggested_improvements.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="mt-0.5">•</span>
              <span className="flex-1">{s}</span>
              <button
                onClick={() => onImprove(s)}
                disabled={improving}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border hover:bg-muted text-[10px]"
              >
                {improving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Scissors className="h-3 w-3" />} Anvend
              </button>
            </div>
          ))}
        </div>
      )}
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
    <div className="text-center">
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full" style={{ width: `${(v / 5) * 100}%`, background: v >= 4 ? "var(--color-sage)" : v >= 3 ? "var(--color-butter)" : "var(--color-clay)" }} />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">{label}</div>
      <div className="text-[10px] font-medium">{v}</div>
    </div>
  );
}
