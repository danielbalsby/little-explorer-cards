import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import {
  AGE_GROUPS, AGE_LABELS, DEVELOPMENT_AREAS, ACTIVITY_TYPES, DURATIONS,
  type AgeGroup, type GeneratedCard,
} from "@/lib/card-schema";
import { generateCard, saveCard, checkSimilarity, shortenCardText } from "@/lib/cards.functions";
import { CardFront } from "@/components/card-front";
import { CardBack } from "@/components/card-back";
import { countPrintWords, fitStatus } from "@/lib/card-text";
import { CARD_FORMAT } from "@/lib/card-format";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Loader2, Save, Scissors } from "lucide-react";

export const Route = createFileRoute("/_authenticated/generer")({
  head: () => ({ meta: [{ title: "Generér kort — Babykort" }] }),
  component: GeneratePage,
});

function GeneratePage() {
  const navigate = useNavigate();
  const gen = useServerFn(generateCard);
  const save = useServerFn(saveCard);
  const sim = useServerFn(checkSimilarity);
  const shorten = useServerFn(shortenCardText);

  const [age, setAge] = useState<AgeGroup>("2-4m");
  const [primary, setPrimary] = useState<string>("Tilknytning");
  const [secondary, setSecondary] = useState<string[]>([]);
  const [activityType, setActivityType] = useState<string>("Kontakt og nærvær");
  const [duration, setDuration] = useState<string>("3-5 minutter");
  const [materialsMode, setMaterialsMode] = useState<"ai" | "include" | "avoid">("ai");
  const [materialsInput, setMaterialsInput] = useState("");
  const [extra, setExtra] = useState("");

  const [preview, setPreview] = useState<GeneratedCard | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const [similar, setSimilar] = useState<Array<{ id: string; card_number: number; title: string; score: number }>>([]);

  const wordCount = preview ? countPrintWords(preview.print) : 0;
  const status = fitStatus(wordCount);

  const generateM = useMutation({
    mutationFn: () => gen({ data: {
      age_group: age, primary_area: primary, secondary_areas: secondary,
      activity_type: activityType, duration,
      materials_mode: materialsMode, materials_input: materialsInput,
      extra_instruction: extra,
    } }),
    onSuccess: async (res) => {
      if (!res.ok) { toast.error(res.error); return; }
      setPreview(res.card);
      const check = await sim({ data: { print: res.card.print } });
      setSimilar(check.matches);
      if (check.matches.length > 0) toast.warning("Kortet minder om eksisterende kort.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const shortenM = useMutation({
    mutationFn: () => shorten({ data: { print: preview!.print } }),
    onSuccess: (res) => {
      if (!res.ok) { toast.error(res.error); return; }
      setPreview({ ...preview!, print: res.print });
      toast.success("Tekst forkortet.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const saveM = useMutation({
    mutationFn: (saveStatus: "draft" | "approved") =>
      save({ data: {
        print: preview!.print,
        extended: preview!.extended,
        illustration_prompt: preview!.illustration_prompt,
        activity_type: preview!.activity_type,
        duration: preview!.duration,
        primary_development_area: preview!.primary_development_area,
        secondary_development_areas: preview!.secondary_development_areas,
        status: saveStatus,
      } }),
    onSuccess: (card) => {
      toast.success("Kort gemt.");
      navigate({ to: "/kort/$id", params: { id: card.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="font-serif text-4xl">Generér aktivitetskort</h1>
        <p className="text-muted-foreground mt-1">Fysisk kort, {CARD_FORMAT.trim.width}×{CARD_FORMAT.trim.height} mm. Kort tekst — max 190 ord.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-5 rounded-2xl border bg-card p-6">
          <FormRow label="Aldersgruppe">
            <Select value={age} onValueChange={(v) => setAge(v as AgeGroup)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {AGE_GROUPS.map((a) => <SelectItem key={a} value={a}>{AGE_LABELS[a]}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormRow>

          <FormRow label="Primært udviklingsområde">
            <Select value={primary} onValueChange={setPrimary}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-72">
                {DEVELOPMENT_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormRow>

          <FormRow label="Sekundære udviklingsområder">
            <div className="flex flex-wrap gap-1.5">
              {DEVELOPMENT_AREAS.filter((a) => a !== primary).map((a) => {
                const on = secondary.includes(a);
                return (
                  <button
                    key={a} type="button"
                    onClick={() => setSecondary(on ? secondary.filter((x) => x !== a) : [...secondary, a])}
                    className={"px-2.5 py-1 rounded-full text-xs border transition-colors " + (on ? "bg-primary/15 border-primary/40" : "bg-background hover:bg-muted")}
                  >{a}</button>
                );
              })}
            </div>
          </FormRow>

          <div className="grid grid-cols-2 gap-4">
            <FormRow label="Aktivitetstype">
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Varighed">
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormRow>
          </div>

          <FormRow label="Materialer">
            <div className="space-y-2">
              <div className="flex gap-2 text-sm">
                {(["ai","include","avoid"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setMaterialsMode(m)}
                    className={"px-3 py-1.5 rounded-full border text-xs " + (materialsMode === m ? "bg-primary/15 border-primary/40" : "hover:bg-muted")}>
                    {m === "ai" ? "AI vælger" : m === "include" ? "Inkludér" : "Undgå"}
                  </button>
                ))}
              </div>
              {materialsMode !== "ai" && (
                <Input placeholder="fx: tørklæde, blød bold" value={materialsInput} onChange={(e) => setMaterialsInput(e.target.value)} />
              )}
            </div>
          </FormRow>

          <FormRow label="Ekstra instruktion">
            <Textarea rows={3} placeholder="fx: rolig aktivitet der kan udføres på puslebord uden legetøj" value={extra} onChange={(e) => setExtra(e.target.value)} />
          </FormRow>

          <Button
            onClick={() => generateM.mutate()}
            disabled={generateM.isPending}
            className="w-full h-11"
            size="lg"
          >
            {generateM.isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Genererer kort…</>
              : <><Sparkles className="mr-2 h-4 w-4" /> Generér aktivitetskort</>}
          </Button>
        </section>

        <section className="space-y-4">
          {preview ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="flex rounded-md border overflow-hidden text-sm">
                  {(["front", "back"] as const).map((s) => (
                    <button key={s} onClick={() => setSide(s)}
                      className={"px-3 py-1.5 " + (side === s ? "bg-muted" : "hover:bg-muted/50")}>
                      {s === "front" ? "Forside" : "Bagside"}
                    </button>
                  ))}
                </div>
                <div className={"text-xs px-2.5 py-1 rounded-full border " +
                  (status === "ok" ? "bg-[color:var(--color-sage)]/25 border-transparent"
                    : status === "warn" ? "bg-[color:var(--color-butter)]/50 border-transparent"
                      : "bg-destructive/20 border-transparent")}>
                  {wordCount} ord {status === "over" ? "· for langt" : status === "warn" ? "· tæt på max" : "· passer"}
                </div>
              </div>

              <div className="flex justify-center">
                {side === "front" ? (
                  <CardFront print={preview.print} />
                ) : (
                  <CardBack />
                )}
              </div>

              {similar.length > 0 && (
                <div className="rounded-xl border bg-[color:var(--color-butter)]/40 p-4 text-sm">
                  <div className="font-medium mb-1">Kan minde om:</div>
                  <ul className="space-y-0.5">
                    {similar.map((s) => (
                      <li key={s.id}>#{s.card_number} · {s.title} <span className="text-muted-foreground">({Math.round(s.score * 100)}% overlap)</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => generateM.mutate()} disabled={generateM.isPending}>
                  Ny version
                </Button>
                <Button variant="outline" onClick={() => shortenM.mutate()} disabled={shortenM.isPending || status === "ok"}>
                  {shortenM.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Scissors className="mr-1.5 h-4 w-4" />}
                  Forkort tekst
                </Button>
                <Button variant="outline" onClick={() => saveM.mutate("draft")} disabled={saveM.isPending}>
                  <Save className="mr-1.5 h-4 w-4" /> Gem som udkast
                </Button>
                <Button onClick={() => saveM.mutate("approved")} disabled={saveM.isPending}>
                  Godkend & gem
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border-2 border-dashed p-10 text-center text-muted-foreground min-h-[400px] grid place-items-center">
              <div>
                <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-40" />
                Preview af aktivitetskortet vises her efter generering.
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
