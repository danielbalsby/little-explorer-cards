import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/designmanual")({
  head: () => ({ meta: [{ title: "Designmanual — Babykort" }] }),
  component: ManualPage,
});

function ManualPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["guidelines"],
    queryFn: async () => (await supabase.from("design_guidelines").select("*").order("sort_order")).data ?? [],
  });

  const [draft, setDraft] = useState({ category: "", title: "", content: "" });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("design_guidelines").insert(draft);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => { toast.success("Tilføjet."); setDraft({ category: "", title: "", content: "" }); qc.invalidateQueries({ queryKey: ["guidelines"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const update = useMutation({
    mutationFn: async (g: { id: string; content: string }) => {
      const { error } = await supabase.from("design_guidelines").update({ content: g.content }).eq("id", g.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => { toast.success("Gemt."); qc.invalidateQueries({ queryKey: ["guidelines"] }); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("design_guidelines").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guidelines"] }),
  });

  const grouped = (data ?? []).reduce<Record<string, typeof data>>((acc, g) => {
    (acc[g.category] ??= [] as never).push(g); return acc;
  }, {});

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="font-serif text-4xl">Designmanual</h1>
        <p className="text-muted-foreground mt-1">Redaktionelle og visuelle principper der styrer projektet.</p>
      </header>

      {Object.entries(grouped ?? {}).map(([cat, items]) => (
        <section key={cat} className="rounded-2xl border bg-card p-6 space-y-4">
          <h2 className="font-serif text-xl">{cat}</h2>
          {items?.map((g) => <Editable key={g.id} g={g} onSave={(content) => update.mutate({ id: g.id, content })} onDelete={() => remove.mutate(g.id)} />)}
        </section>
      ))}

      <section className="rounded-2xl border-2 border-dashed p-6 space-y-3">
        <h2 className="font-serif text-lg">Tilføj retningslinje</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Kategori</Label><Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></div>
          <div><Label>Titel</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
        </div>
        <div><Label>Indhold</Label><Textarea rows={3} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></div>
        <Button onClick={() => create.mutate()} disabled={!draft.category || !draft.title}>
          <Plus className="mr-1.5 h-4 w-4" /> Tilføj
        </Button>
      </section>
    </div>
  );
}

function Editable({ g, onSave, onDelete }: { g: { id: string; title: string; content: string }; onSave: (v: string) => void; onDelete: () => void }) {
  const [v, setV] = useState(g.content);
  const changed = v !== g.content;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <Label className="text-sm">{g.title}</Label>
        <button onClick={onDelete} className="text-muted-foreground hover:text-destructive text-xs inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> slet</button>
      </div>
      <Textarea rows={2} value={v} onChange={(e) => setV(e.target.value)} />
      {changed && <Button size="sm" variant="outline" onClick={() => onSave(v)}><Save className="mr-1.5 h-3 w-3" /> Gem</Button>}
    </div>
  );
}
