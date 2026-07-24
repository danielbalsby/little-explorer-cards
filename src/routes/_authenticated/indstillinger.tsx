import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { BACK_RENDERERS, BACK_VARIANTS, type BackVariant } from "@/components/card-variants/backs";

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

  // Brand
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [showTagline, setShowTagline] = useState(true);
  const [masterBack, setMasterBack] = useState<BackVariant>("storybook_emblem");
  const [logoUrl, setLogoUrl] = useState("");
  const [markUrl, setMarkUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#342D27");
  const [secondaryColor, setSecondaryColor] = useState("#AAB9A3");
  const [printTexture, setPrintTexture] = useState<"baked_in" | "clean">("baked_in");
  const [duplexFlip, setDuplexFlip] = useState<"long_edge" | "short_edge">("long_edge");

  useEffect(() => {
    if (!data) return;
    setName(data.project_name);
    setTarget(data.target_card_count);
    setBrandName(data.brand_name ?? "Babykort");
    setTagline(data.brand_tagline ?? "Små stunder sammen");
    setShowTagline(data.show_tagline ?? true);
    setMasterBack((data.master_card_back as BackVariant) ?? "storybook_emblem");
    setLogoUrl(data.brand_logo_url ?? "");
    setMarkUrl(data.brand_mark_url ?? "");
    setPrimaryColor(data.primary_brand_color ?? "#342D27");
    setSecondaryColor(data.secondary_brand_color ?? "#AAB9A3");
    setPrintTexture((data.print_texture as "baked_in" | "clean") ?? "baked_in");
    setDuplexFlip((data.duplex_flip as "long_edge" | "short_edge") ?? "long_edge");
  }, [data]);

  const update = useMutation({
    mutationFn: async () => {
      if (!data) return;
      const { error } = await supabase
        .from("project_settings")
        .update({
          project_name: name,
          target_card_count: target,
          brand_name: brandName,
          brand_tagline: tagline,
          show_tagline: showTagline,
          master_card_back: masterBack,
          brand_logo_url: logoUrl || null,
          brand_mark_url: markUrl || null,
          primary_brand_color: primaryColor,
          secondary_brand_color: secondaryColor,
          print_texture: printTexture,
          duplex_flip: duplexFlip,
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Gemt.");
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["brand-settings"] });
    },
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

  const MasterBackR = BACK_RENDERERS[masterBack];

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="font-serif text-4xl">Indstillinger</h1>
        <p className="text-muted-foreground mt-1">Projekt, brand og produktion.</p>
      </header>

      {/* Projekt */}
      <section className="rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl">Projekt</h2>
        <div><Label>Projektnavn</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>Målantal kort</Label><Input type="number" min={1} value={target} onChange={(e) => setTarget(Number(e.target.value))} /></div>
      </section>

      {/* Brand */}
      <section className="rounded-2xl border bg-card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl">Brand</h2>
            <p className="text-sm text-muted-foreground">Bruges globalt på bagsiden og på tværs af hele serien.</p>
          </div>
          <div style={{ filter: "drop-shadow(0 8px 12px rgba(52,45,39,0.15))" }}>
            <MasterBackR scale={0.5} brandName={brandName} tagline={tagline} showTagline={showTagline} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><Label>Brandnavn</Label><Input value={brandName} onChange={(e) => setBrandName(e.target.value)} /></div>
          <div>
            <Label>Tagline</Label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
            <label className="mt-2 inline-flex items-center gap-2 text-xs">
              <input type="checkbox" checked={showTagline} onChange={(e) => setShowTagline(e.target.checked)} /> Vis tagline på bagsiden
            </label>
          </div>
          <div><Label>Logo (URL)</Label><Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Valgfrit – reserveret til senere" /></div>
          <div><Label>Brandmark (URL)</Label><Input value={markUrl} onChange={(e) => setMarkUrl(e.target.value)} placeholder="Valgfrit – erstatter placeholder 'b'" /></div>
          <div>
            <Label>Primær brandfarve</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-9 w-12 rounded border" />
              <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Sekundær brandfarve</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-9 w-12 rounded border" />
              <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <Label>Master card back</Label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {BACK_VARIANTS.map((v) => {
              const R = BACK_RENDERERS[v.id];
              const selected = masterBack === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setMasterBack(v.id)}
                  className={"rounded-xl border p-3 text-left transition " + (selected ? "border-foreground bg-muted/40" : "hover:bg-muted/30")}
                >
                  <div className="flex justify-center py-2">
                    <div style={{ filter: "drop-shadow(0 6px 8px rgba(52,45,39,0.15))" }}>
                      <R scale={0.35} brandName={brandName} tagline={tagline} showTagline={showTagline} />
                    </div>
                  </div>
                  <div className="text-xs font-medium mt-2">{v.name}</div>
                  <div className="text-[10px] text-muted-foreground">{v.tagline}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <Link to="/design-lab" className="underline">Åbn Design-lab</Link> for at sammenligne med mockups.
          </div>
        </div>
      </section>

      {/* Print / produktion */}
      <section className="rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl">Print & produktion</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Papirtekstur i tryk</Label>
            <div className="mt-2 flex rounded-md border overflow-hidden text-sm">
              {(["baked_in", "clean"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setPrintTexture(v)}
                  className={"px-3 py-1.5 flex-1 " + (printTexture === v ? "bg-muted" : "hover:bg-muted/50")}>
                  {v === "baked_in" ? "Texture baked in" : "Clean artwork"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Vælg <em>Clean artwork</em> hvis trykkeriet bruger struktureret papir.
            </p>
          </div>
          <div>
            <Label>Duplex-orientering</Label>
            <div className="mt-2 flex rounded-md border overflow-hidden text-sm">
              {(["long_edge", "short_edge"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setDuplexFlip(v)}
                  className={"px-3 py-1.5 flex-1 " + (duplexFlip === v ? "bg-muted" : "hover:bg-muted/50")}>
                  {v === "long_edge" ? "Flip · lang kant" : "Flip · kort kant"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={() => update.mutate()}><Save className="mr-1.5 h-4 w-4" /> Gem indstillinger</Button>
      </div>

      <section className="rounded-2xl border bg-card p-6 space-y-3">
        <h2 className="font-serif text-xl">Demoindhold</h2>
        <p className="text-sm text-muted-foreground">Startsættet på 6 demokort kan slettes når projektet indeholder egne kort.</p>
        <Button variant="outline" onClick={() => { if (confirm("Slet alle demokort?")) clearDemo.mutate(); }}>
          Slet demokort
        </Button>
      </section>
    </div>
  );
}
