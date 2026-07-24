import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EditorialFront } from "@/components/card-variants/editorial";
import { OrganicFront } from "@/components/card-variants/organic";
import { StorybookFront } from "@/components/card-variants/storybook";
import { REFERENCE_CARD } from "@/lib/card-variants";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/design-lab")({
  head: () => ({
    meta: [
      { title: "Design-lab · Babykort" },
      { name: "description", content: "Sammenlign tre visuelle retninger for det fysiske aktivitetskort." },
      { property: "og:title", content: "Design-lab · Babykort" },
      { property: "og:description", content: "Editorial, Organic og Minimal Storybook — sammenlignet på samme referencekort." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignLab,
});

type Variant = "editorial" | "organic" | "storybook";

const VARIANTS: Array<{
  id: Variant;
  name: string;
  tagline: string;
  description: string;
}> = [
  {
    id: "editorial",
    name: "A · Editorial",
    tagline: "Bogtitel · meget luft · typografien bærer",
    description:
      "Mest typografi. Titlen står som en bogtitel. Illustrationen er en lille accent i hjørnet. Sektioner adskilles af diskrete linjer og små tonale prikker.",
  },
  {
    id: "organic",
    name: "B · Organic",
    tagline: "Bløde farveformer · varm og taktil",
    description:
      "Organiske sage- og butter-blobs ligger bag indholdet. Numre står i cirkler i clay. Se efter / Pause hvis ligger på svage tonale flader.",
  },
  {
    id: "storybook",
    name: "C · Minimal Storybook",
    tagline: "Illustration som scene · rolig fortælling",
    description:
      "Øverste tredjedel er en let scene: to profiler, tæppe, et blad. Håndtegnede talcirkler. Support-sektioner som stille stemme.",
  },
];

function DesignLab() {
  const [master, setMaster] = useState<Variant | null>(() => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem("master_card_design") as Variant | null) ?? null;
  });
  const [scale, setScale] = useState(1.15);

  function chooseMaster(v: Variant) {
    localStorage.setItem("master_card_design", v);
    setMaster(v);
  }

  const Renderers: Record<Variant, React.FC<{ print: typeof REFERENCE_CARD; scale?: number }>> = {
    editorial: EditorialFront,
    organic: OrganicFront,
    storybook: StorybookFront,
  };

  return (
    <div className="min-h-screen" style={{ background: "#EFE9DE" }}>
      <div className="mx-auto max-w-[1600px] px-6 py-10">
        <header className="mb-8 flex items-start justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Visuel udvikling
            </div>
            <h1 className="mt-1 font-serif text-4xl">Design-lab</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Tre visuelle retninger på samme referencekort — <em>Ansigt til ansigt</em>. Vælg
              den retning der føles mest som et fysisk premium-produkt. Valget gemmes som{" "}
              <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">master_card_design</code>{" "}
              og kan senere anvendes på hele serien.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Zoom</span>
            <input
              type="range"
              min={0.9}
              max={1.6}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-40"
            />
            <span className="tabular-nums text-muted-foreground">{Math.round(scale * 100)}%</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {VARIANTS.map((v) => {
            const R = Renderers[v.id];
            const isMaster = master === v.id;
            return (
              <section key={v.id} className="flex flex-col items-center">
                <div className="mb-4 w-full text-center">
                  <div className="font-serif text-xl">{v.name}</div>
                  <div className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
                    {v.tagline}
                  </div>
                </div>

                {/* Mockup-flade: neutral papirbaggrund med skygge */}
                <div
                  className="rounded-2xl p-8"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 50% 20%, #F4EEDF 0%, #E6DDC9 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  }}
                >
                  <div style={{ filter: "drop-shadow(0 30px 40px rgba(52,45,39,0.18))" }}>
                    <R print={REFERENCE_CARD} scale={scale} />
                  </div>
                </div>

                <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>

                <Button
                  variant={isMaster ? "default" : "outline"}
                  className="mt-4"
                  onClick={() => chooseMaster(v.id)}
                >
                  {isMaster ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Valgt som master
                    </>
                  ) : (
                    "Vælg som master"
                  )}
                </Button>
              </section>
            );
          })}
        </div>

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          Alle tre retninger renderes i fysiske proportioner (A6 · 105 × 148 mm) med subtil papirtekstur.
          Bagsiden og resten af serien redesignes først, når én master er valgt.
        </footer>
      </div>
    </div>
  );
}
