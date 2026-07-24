import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  AGE_GROUPS, AGE_LABELS, DEVELOPMENT_AREAS, ACTIVITY_TYPES, DURATIONS,
  type AgeGroup, type CardContent,
} from "@/lib/card-schema";
import { saveCard, deleteCard, duplicateCard, toggleLock, checkSimilarity } from "@/lib/cards.functions";
import { CardPreview } from "@/components/card-preview";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Lock, Unlock, Trash2, Check, X, Save, Printer } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/kort/$id")({
  head: () => ({ meta: [{ title: "Redigér kort — Babykort" }] }),
  component: CardEditor,
});

function CardEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const save = useServerFn(saveCard);
  const del = useServerFn(deleteCard);
  const dup = useServerFn(duplicateCard);
  const lock = useServerFn(toggleLock);
  const sim = useServerFn(checkSimilarity);

  const { data: card } = useQuery({
    queryKey: ["card", id],
    queryFn: async () => (await supabase.from("cards").select("*").eq("id", id).single()).data,
  });
  const { data: versions } = useQuery({
    queryKey: ["versions", id],
    queryFn: async () => (await supabase.from("card_versions").select("*").eq("card_id", id).order("version_number", { ascending: false })).data ?? [],
  });

  const [form, setForm] = useState<CardContent | null>(null);
  const [changeNote, setChangeNote] = useState("");
  useEffect(() => {
    if (card) {
      setForm({
        title: card.title, age_group: card.age_group as AgeGroup,
        purpose: card.purpose, primary_development_area: card.primary_development_area,
        secondary_development_areas: (card.secondary_development_areas as string[]) ?? [],
        materials: (card.materials as string[]) ?? [],
        activity_steps: (card.activity_steps as string[]) ?? [],
        variations: (card.variations as string[]) ?? [],
        observations: card.observations, pause_signs: card.pause_signs,
        safety: card.safety, did_you_know: card.did_you_know,
        activity_type: card.activity_type, duration: card.duration,
      });
    }
  }, [card]);

  const saveM = useMutation({
    mutationFn: (status?: "draft" | "approved" | "rejected") =>
      save({ data: { id, content: form!, status, change_note: changeNote || undefined } }),
    onSuccess: () => {
      toast.success("Gemt.");
      setChangeNote("");
      queryClient.invalidateQueries({ queryKey: ["card", id] });
      queryClient.invalidateQueries({ queryKey: ["versions", id] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const dupM = useMutation({
    mutationFn: () => dup({ data: { id } }),
    onSuccess: (c) => { toast.success("Duplikeret."); navigate({ to: "/kort/$id", params: { id: c.id } }); },
  });
  const delM = useMutation({
    mutationFn: () => del({ data: { id } }),
    onSuccess: () => { toast.success("Slettet."); navigate({ to: "/bibliotek" }); },
  });
  const lockM = useMutation({
    mutationFn: (locked: boolean) => lock({ data: { id, locked } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["card", id] }),
  });

  async function checkSim() {
    if (!form) return;
    const r = await sim({ data: { card: form, excludeId: id } });
    if (r.matches.length === 0) toast.success("Ingen tydelige overlap fundet.");
    else toast.warning(`Ligner: ${r.matches.map((m) => `#${m.card_number}`).join(", ")}`);
  }

  if (!card || !form) return <div className="p-10 text-muted-foreground">Indlæser…</div>;

  const locked = card.is_locked;
  const setF = <K extends keyof CardContent>(k: K, v: CardContent[K]) => setForm({ ...form, [k]: v });
  const setList = (k: "materials" | "activity_steps" | "variations", v: string) =>
    setF(k, v.split("\n").map((s) => s.trim()).filter(Boolean) as never);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="text-xs text-muted-foreground">#{String(card.card_number).padStart(3, "0")} · v{card.version}{locked && " · Låst"}</div>
          <h1 className="font-serif text-3xl mt-1">{form.title || "Uden titel"}</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/kort/$id/print" params={{ id }}>
            <Button variant="outline" size="sm"><Printer className="mr-1.5 h-4 w-4" /> Print preview</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={checkSim}>Kontrollér original</Button>
          <Button variant="outline" size="sm" onClick={() => dupM.mutate()}><Copy className="mr-1.5 h-4 w-4" /> Duplikér</Button>
          <Button variant="outline" size="sm" onClick={() => lockM.mutate(!locked)}>
            {locked ? <><Unlock className="mr-1.5 h-4 w-4" /> Lås op</> : <><Lock className="mr-1.5 h-4 w-4" /> Lås</>}
          </Button>
          <Button variant="outline" size="sm" onClick={() => { if (confirm("Slet kortet permanent?")) delM.mutate(); }}>
            <Trash2 className="mr-1.5 h-4 w-4" /> Slet
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className={"space-y-4 rounded-2xl border bg-card p-6 " + (locked ? "opacity-70" : "")}>
          <Field label="Titel"><Input value={form.title} disabled={locked} onChange={(e) => setF("title", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Aldersgruppe">
              <Select value={form.age_group} disabled={locked} onValueChange={(v) => setF("age_group", v as AgeGroup)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{AGE_GROUPS.map((a) => <SelectItem key={a} value={a}>{AGE_LABELS[a]}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Varighed">
              <Select value={form.duration} disabled={locked} onValueChange={(v) => setF("duration", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DURATIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primært område">
              <Select value={form.primary_development_area} disabled={locked} onValueChange={(v) => setF("primary_development_area", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">{DEVELOPMENT_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Aktivitetstype">
              <Select value={form.activity_type} disabled={locked} onValueChange={(v) => setF("activity_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ACTIVITY_TYPES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Sekundære områder (komma-adskilt)">
            <Input value={form.secondary_development_areas.join(", ")} disabled={locked}
              onChange={(e) => setF("secondary_development_areas", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
          </Field>
          <Field label="Formål"><Textarea rows={3} value={form.purpose} disabled={locked} onChange={(e) => setF("purpose", e.target.value)} /></Field>
          <Field label="Materialer (én pr. linje)"><Textarea rows={3} value={form.materials.join("\n")} disabled={locked} onChange={(e) => setList("materials", e.target.value)} /></Field>
          <Field label="Aktivitetstrin (én pr. linje)"><Textarea rows={5} value={form.activity_steps.join("\n")} disabled={locked} onChange={(e) => setList("activity_steps", e.target.value)} /></Field>
          <Field label="Variationer (én pr. linje)"><Textarea rows={4} value={form.variations.join("\n")} disabled={locked} onChange={(e) => setList("variations", e.target.value)} /></Field>
          <Field label="Observer barnet"><Textarea rows={2} value={form.observations} disabled={locked} onChange={(e) => setF("observations", e.target.value)} /></Field>
          <Field label="Tegn på pause"><Textarea rows={2} value={form.pause_signs} disabled={locked} onChange={(e) => setF("pause_signs", e.target.value)} /></Field>
          <Field label="Sikkerhed"><Textarea rows={2} value={form.safety} disabled={locked} onChange={(e) => setF("safety", e.target.value)} /></Field>
          <Field label="Vidste du?"><Textarea rows={2} value={form.did_you_know} disabled={locked} onChange={(e) => setF("did_you_know", e.target.value)} /></Field>

          <Field label="Ændringsnote (til historik)">
            <Input value={changeNote} disabled={locked} onChange={(e) => setChangeNote(e.target.value)} placeholder="fx: præciseret formål" />
          </Field>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" onClick={() => saveM.mutate("draft")} disabled={locked || saveM.isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Gem som udkast
            </Button>
            <Button onClick={() => saveM.mutate("approved")} disabled={locked || saveM.isPending}>
              <Check className="mr-1.5 h-4 w-4" /> Godkend
            </Button>
            <Button variant="outline" onClick={() => saveM.mutate("rejected")} disabled={saveM.isPending}>
              <X className="mr-1.5 h-4 w-4" /> Afvis
            </Button>
          </div>
        </section>

        <section className="space-y-6">
          <CardPreview card={form} />

          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-serif text-lg mb-3">Versionshistorik</h3>
            <ul className="text-sm divide-y">
              {(versions ?? []).map((v) => (
                <li key={v.id} className="py-2 flex justify-between gap-2">
                  <span>v{v.version_number}{v.change_note ? ` — ${v.change_note}` : ""}</span>
                  <span className="text-muted-foreground text-xs">{new Date(v.created_at).toLocaleString("da-DK")}</span>
                </li>
              ))}
              {(versions ?? []).length === 0 && <li className="py-3 text-muted-foreground text-sm">Ingen tidligere versioner endnu.</li>}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
