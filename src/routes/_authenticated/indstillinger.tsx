import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/indstillinger")({
  head: () => ({ meta: [{ title: "Indstillinger — Babykort" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await supabase.from("project_settings").select("*").maybeSingle()).data,
  });

  const [name, setName] = useState("");
  const [target, setTarget] = useState(120);
  useEffect(() => { if (data) { setName(data.project_name); setTarget(data.target_card_count); } }, [data]);

  const update = useMutation({
    mutationFn: async () => {
      if (!data) return;
      const { error } = await supabase.from("project_settings").update({ project_name: name, target_card_count: target }).eq("id", data.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => { toast.success("Gemt."); qc.invalidateQueries({ queryKey: ["settings"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  const clearDemo = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("cards").delete().eq("is_demo", true);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => { toast.success("Demokort slettet."); qc.invalidateQueries(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Fejl"),
  });

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="font-serif text-4xl">Indstillinger</h1>
        <p className="text-muted-foreground mt-1">Grundlæggende projektopsætning.</p>
      </header>

      <section className="rounded-2xl border bg-card p-6 space-y-4">
        <div><Label>Projektnavn</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>Målantal kort</Label><Input type="number" min={1} value={target} onChange={(e) => setTarget(Number(e.target.value))} /></div>
        <Button onClick={() => update.mutate()}><Save className="mr-1.5 h-4 w-4" /> Gem</Button>
      </section>

      <section className="rounded-2xl border bg-card p-6 space-y-3">
        <h2 className="font-serif text-xl">Demoindhold</h2>
        <p className="text-sm text-muted-foreground">Startsættet på 6 demokort kan slettes når projektet indeholder egne kort.</p>
        <Button variant="outline" onClick={() => { if (confirm("Slet alle demokort?")) clearDemo.mutate(); }}>
          Slet demokort
        </Button>
      </section>

      <section className="rounded-2xl border-2 border-dashed p-6 space-y-2 opacity-70">
        <h2 className="font-serif text-lg">Kommer senere</h2>
        <ul className="text-sm space-y-1">
          <li>· Eksport til PDF, Canva, InDesign og trykklare filer</li>
          <li>· Forældre-konti og personlige samlinger</li>
          <li>· Abonnement, betaling og favoritter</li>
          <li>· Semantisk originalitetskontrol med embeddings</li>
        </ul>
      </section>
    </div>
  );
}
