import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StorybookFront } from "@/components/card-variants/storybook";
import {
  BACK_RENDERERS,
  BACK_VARIANTS,
  type BackVariant,
  type CardBackProps,
} from "@/components/card-variants/backs";
import {
  BACK_ROUND2_RENDERERS,
  BACK_ROUND2_VARIANTS,
  type BackRound2Variant,
} from "@/components/card-variants/backs-round2";
import {
  BRANDMARK_VARIANTS,
  Brandmark,
  type BrandmarkVariant,
} from "@/components/card-variants/brandmarks";
import { SCENE_RENDERERS, type SceneKey } from "@/components/card-variants/scenes";
import type { PrintContent } from "@/lib/card-schema";
import { REFERENCE_CARD } from "@/lib/card-variants";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/design-lab")({
  head: () => ({
    meta: [
      { title: "Design-lab · Beslutningsrum" },
      { name: "description", content: "Unikke forsideillustrationer, Brand Lab og Round 2 bagsider." },
      { property: "og:title", content: "Design-lab · Beslutningsrum" },
      { property: "og:description", content: "Testkort med unikke scener, brandnavne, brandmarks og nye bagsider." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignLab,
});

// ---------- 5 testforsider med UNIKKE scener ----------

interface FrontSample {
  label: string;
  print: PrintContent;
  scene: SceneKey;
  brief: {
    scene: string;
    main_motif: string;
    secondary: string;
    relation: string;
    composition: string;
    mood: string;
  };
}

const FRONT_SAMPLES: FrontSample[] = [
  {
    label: "Ansigt til ansigt",
    print: REFERENCE_CARD,
    scene: "face",
    brief: {
      scene: "Voksen og baby sidder tæt over for hinanden.",
      main_motif: "To rolige profiler i tone-i-tone.",
      secondary: "Blødt sollys, lille turtagningsbue.",
      relation: "Ansigt-til-ansigt-kontakt ER aktivitetens kerne.",
      composition: "Symmetrisk parring med blødt lysfelt bagved.",
      mood: "Rolig, opmærksom, varm.",
    },
  },
  {
    label: "Bløde spark",
    print: {
      ...REFERENCE_CARD,
      title: "Bløde spark",
      age_group: "4-6m",
      development_areas: ["Motorik", "Krop", "Balance"],
      intro: "En lille rytme mellem jeres hænder og babys fødder.",
      steps: [
        "Læg baby på ryggen, du sidder foran.",
        "Læg dine hænder blidt mod fodsålerne.",
        "Vent på et lille spark.",
        "Svar med et blidt modtryk.",
      ],
      variations: ["Skift hastighed", "Nyn en tone imens"],
      look_for: "Hvis baby sparker igen, følg rytmen.",
      pause_if: "Baby stivner eller kigger væk.",
      did_you_know: "",
      safety: "",
      materials: "",
    },
    scene: "feet",
    brief: {
      scene: "Små fødder møder to åbne hænder.",
      main_motif: "Babys to fødder.",
      secondary: "Voksne håndformer, små bevægelseslinjer.",
      relation: "Fødder + rytme + modtryk.",
      composition: "Vandret parring med organisk gul form bagved.",
      mood: "Legende, blid, rytmisk.",
    },
  },
  {
    label: "Bladet der bevæger sig",
    print: {
      ...REFERENCE_CARD,
      title: "Bladet der bevæger sig",
      age_group: "6-9m",
      development_areas: ["Sanser", "Opmærksomhed", "Natur"],
      intro: "Et blad, lidt vind, og et roligt sansemoment.",
      steps: [
        "Sæt jer ude eller ved et åbent vindue.",
        "Hold et blad frem for baby.",
        "Lad det blafre roligt i luften.",
        "Følg babys blik.",
      ],
      variations: ["Prøv et strå", "Prøv en fjer"],
      look_for: "Hvis baby følger bladet, bevæg det langsomt videre.",
      pause_if: "Baby vender sig væk eller trækker sig.",
      did_you_know: "", safety: "", materials: "",
    },
    scene: "leaf",
    brief: {
      scene: "Ét stort blad blafrer roligt i vinden.",
      main_motif: "Bladet.",
      secondary: "Vindkurve, antydning af vindue og græs.",
      relation: "Blik + bevægelse + natur.",
      composition: "Diagonal med bladet centreret og luftig baggrund.",
      mood: "Rolig, nysgerrig, sansende.",
    },
  },
  {
    label: "Ord for det vi ser",
    print: {
      ...REFERENCE_CARD,
      title: "Ord for det vi ser",
      age_group: "9-12m",
      development_areas: ["Sprog", "Fælles opmærksomhed", "Ordforråd"],
      intro: "En stille navngivning af hverdagens ting.",
      steps: [
        "Sæt jer sammen ved noget kendt.",
        "Peg på én ting.",
        "Sig ordet stille og tydeligt.",
        "Vent på babys reaktion.",
      ],
      variations: ["Prøv med en bog", "Prøv udenfor"],
      look_for: "Hvis baby kigger med, gentag ordet.",
      pause_if: "Baby bliver træt eller urolig.",
      did_you_know: "", safety: "", materials: "",
    },
    scene: "room_word",
    brief: {
      scene: "Voksen og baby ser sammen ud mod et roligt hverdagsrum.",
      main_motif: "Vindue med varmt lys.",
      secondary: "Enkel plante, silhuetter, små talebuer.",
      relation: "Fælles opmærksomhed + ord + hverdag.",
      composition: "Roligt interiør med to silhuetter i højre halvdel.",
      mood: "Stille, opmærksom, hverdagsagtig.",
    },
  },
  {
    label: "Puslebordets sang",
    print: {
      ...REFERENCE_CARD,
      title: "Puslebordets sang",
      age_group: "0-2m",
      development_areas: ["Tryghed", "Rytme", "Stemme"],
      intro: "En lille tone der binder hverdagens skift sammen.",
      steps: [
        "Læg baby blidt på puslebordet.",
        "Nyn den samme korte melodi hver gang.",
        "Bevæg dig roligt.",
        "Slut med et lille smil.",
      ],
      variations: ["Skift ord ud med babys navn", "Prøv en anden hverdagssituation"],
      look_for: "Baby genkender melodien efter få dage.",
      pause_if: "Baby græder eller stivner.",
      did_you_know: "", safety: "", materials: "",
    },
    scene: "changing_table_song",
    brief: {
      scene: "Baby ligger blidt på puslepuden mens en stemme nynner.",
      main_motif: "Puslepudens bløde form med små fødder.",
      secondary: "En voksens hånd, lydkurver og en lille note.",
      relation: "Puslesituation + stemme + rytme.",
      composition: "Vandret pude nederst, lyd svæver ovenover.",
      mood: "Tryg, rytmisk, blid.",
    },
  },
];

// ---------- Brand-navne til Brand Lab ----------

const BRAND_NAMES = [
  { name: "Lille Nu", tagline: "Små stunder sammen" },
  { name: "Små Stunder", tagline: "Leg, nærvær og nysgerrighed" },
  { name: "Nær", tagline: "Små stunder sammen" },
  { name: "Lille Sammen", tagline: "Det første år, sammen" },
  { name: "Babykort", tagline: "Små stunder sammen" },
];

const PANEL_BG = "radial-gradient(120% 80% at 50% 20%, #F4EEDF 0%, #E6DDC9 100%)";

function DesignLab() {
  const [masterBack, setMasterBack] = useState<BackVariant | null>(() => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem("master_card_back") as BackVariant | null) ?? null;
  });
  const [frontScale, setFrontScale] = useState(0.9);
  const [backScale, setBackScale] = useState(1.15);
  const [selectedBrandmark, setSelectedBrandmark] = useState<BrandmarkVariant>("relation");
  const [selectedBrandIdx, setSelectedBrandIdx] = useState(0);
  const [showTagline, setShowTagline] = useState(true);

  function chooseBack(v: BackVariant) {
    localStorage.setItem("master_card_back", v);
    setMasterBack(v);
  }

  const brand = BRAND_NAMES[selectedBrandIdx];

  return (
    <div className="min-h-screen" style={{ background: "#EFE9DE" }}>
      <div className="mx-auto max-w-[1600px] px-6 py-10 space-y-20">
        <header>
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Visuel system V3 · beslutningsrum
          </div>
          <h1 className="mt-1 font-serif text-4xl">Design-lab</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Unikke forsideillustrationer per aktivitet, ny brandidentitet og Round 2 af den fælles
            bagside. Intet låses her — dette er beslutningsrummet.
          </p>
        </header>

        {/* -------------------- DEL 1: UNIKKE FORSIDER -------------------- */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Del 1</div>
              <h2 className="font-serif text-2xl mt-1">Forsidefamilien · 5 unikke scener</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mt-1">
                Style lock er fælles (streg, palette, negativt rum). Scenen fortæller aktiviteten.
                Ansigt-til-ansigt-motivet bruges kun hvor det giver mening.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Zoom</span>
              <input type="range" min={0.7} max={1.2} step={0.05}
                value={frontScale} onChange={(e) => setFrontScale(parseFloat(e.target.value))}
                className="w-32" />
              <span className="tabular-nums text-muted-foreground">{Math.round(frontScale * 100)}%</span>
            </div>
          </div>

          <div className="rounded-2xl p-8 overflow-x-auto" style={{ background: PANEL_BG }}>
            <div className="flex flex-wrap gap-10 justify-center items-start">
              {FRONT_SAMPLES.map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-3 max-w-[280px]">
                  <div style={{ filter: "drop-shadow(0 20px 30px rgba(52,45,39,0.16))" }}>
                    <StorybookFront print={f.print} scale={frontScale} scene={f.scene} />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</div>
                  <details className="text-[11px] text-muted-foreground max-w-[240px]">
                    <summary className="cursor-pointer">Illustrationsbrief</summary>
                    <dl className="mt-2 space-y-1 text-left">
                      <div><dt className="inline font-medium">Scene: </dt><dd className="inline">{f.brief.scene}</dd></div>
                      <div><dt className="inline font-medium">Motiv: </dt><dd className="inline">{f.brief.main_motif}</dd></div>
                      <div><dt className="inline font-medium">Sekundært: </dt><dd className="inline">{f.brief.secondary}</dd></div>
                      <div><dt className="inline font-medium">Relation: </dt><dd className="inline">{f.brief.relation}</dd></div>
                      <div><dt className="inline font-medium">Komposition: </dt><dd className="inline">{f.brief.composition}</dd></div>
                      <div><dt className="inline font-medium">Mood: </dt><dd className="inline">{f.brief.mood}</dd></div>
                    </dl>
                  </details>
                </div>
              ))}
            </div>
          </div>

          {/* Illustrationsark — kun scener, ingen tekst */}
          <div className="mt-8">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              Illustrationsark · konsistens-test (uden tekst)
            </div>
            <div className="rounded-2xl p-8" style={{ background: PANEL_BG }}>
              <div className="flex flex-wrap gap-6 justify-center">
                {FRONT_SAMPLES.map((f) => {
                  const Scene = require("@/components/card-variants/scenes").SCENE_RENDERERS[f.scene];
                  return (
                    <div key={f.label} className="flex flex-col items-center gap-2">
                      <div style={{
                        width: 180, height: 140,
                        background: "#F8F4EC",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 8px 20px -8px rgba(52,45,39,0.2)",
                      }}>
                        <Scene />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------- DEL 2: BRAND LAB -------------------- */}
        <section>
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Del 2</div>
            <h2 className="font-serif text-2xl mt-1">Brand Lab</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              "Babykort" er et arbejdsnavn. Vurdér brandnavne visuelt sammen med brandmark og bagside.
              Ingen automatisk vinder — du vælger.
            </p>
          </div>

          {/* Brandnavne */}
          <div className="rounded-2xl p-8 mb-8" style={{ background: PANEL_BG }}>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Brandnavn · typografisk preview</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {BRAND_NAMES.map((b, i) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => setSelectedBrandIdx(i)}
                  className="rounded-xl bg-white/70 p-6 text-left hover:bg-white transition"
                  style={{
                    outline: selectedBrandIdx === i ? "2px solid #342D27" : "none",
                  }}
                >
                  <div style={{
                    fontFamily: "'Fraunces', 'Cormorant Garamond', serif",
                    fontSize: "22pt", fontWeight: 500, letterSpacing: "0.01em", lineHeight: 1,
                  }}>{b.name}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">{b.tagline}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Brandmarks */}
          <div className="rounded-2xl p-8" style={{ background: PANEL_BG }}>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Brandmark · 3 konceptretninger</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {BRANDMARK_VARIANTS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedBrandmark(m.id)}
                  className="rounded-xl bg-white/70 p-6 flex flex-col items-center gap-3 hover:bg-white transition"
                  style={{
                    outline: selectedBrandmark === m.id ? "2px solid #342D27" : "none",
                  }}
                >
                  <Brandmark variant={m.id} size={18} />
                  <div>
                    <div className="font-serif text-base text-center">{m.name}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center mt-1">
                      {m.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------- DEL 3: ROUND 2 BAGSIDER -------------------- */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Del 3</div>
              <h2 className="font-serif text-2xl mt-1">Bagside · Round 2</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mt-1">
                Tre nye retninger — mere moderne, charmerende og brandbar.
                Vises med "{brand.name}" + {BRANDMARK_VARIANTS.find(m => m.id === selectedBrandmark)?.name}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={showTagline} onChange={(e) => setShowTagline(e.target.checked)} />
                <span>Vis tagline</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Zoom</span>
                <input type="range" min={0.8} max={1.4} step={0.05}
                  value={backScale} onChange={(e) => setBackScale(parseFloat(e.target.value))}
                  className="w-32" />
                <span className="tabular-nums text-muted-foreground">{Math.round(backScale * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {BACK_ROUND2_VARIANTS.map((v) => {
              const R = BACK_ROUND2_RENDERERS[v.id];
              const props = {
                scale: backScale,
                brandName: brand.name,
                tagline: brand.tagline,
                showTagline,
                brandmark: selectedBrandmark,
              };
              return (
                <section key={v.id} className="flex flex-col items-center">
                  <div className="mb-4 w-full text-center">
                    <div className="font-serif text-xl">{v.name}</div>
                    <div className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
                      {v.tagline}
                    </div>
                  </div>

                  {/* Enkelt kort */}
                  <div className="rounded-2xl p-8 w-full flex justify-center" style={{ background: PANEL_BG }}>
                    <div style={{ filter: "drop-shadow(0 30px 40px rgba(52,45,39,0.18))" }}>
                      <R {...props} />
                    </div>
                  </div>

                  <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>

                  {/* Thumbnail — vigtigt: virker det som lille logo? */}
                  <div className="mt-6 w-full">
                    <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                      Lille thumbnail (fungerer det?)
                    </div>
                    <div className="rounded-xl p-6 flex justify-center" style={{ background: PANEL_BG }}>
                      <div style={{ filter: "drop-shadow(0 4px 8px rgba(52,45,39,0.2))" }}>
                        <R {...props} scale={0.35} />
                      </div>
                    </div>
                  </div>

                  {/* 10 kort spredt */}
                  <div className="mt-4 w-full">
                    <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                      10 kort spredt
                    </div>
                    <div className="rounded-xl p-6 relative overflow-hidden" style={{ background: PANEL_BG, height: 220 }}>
                      {Array.from({ length: 10 }).map((_, i) => {
                        const angle = ((i * 37) % 40) - 20;
                        const x = (i * 53) % 260;
                        const y = 10 + ((i * 29) % 90);
                        return (
                          <div key={i} style={{
                            position: "absolute", left: x, top: y,
                            transform: `rotate(${angle}deg)`,
                            filter: "drop-shadow(0 8px 12px rgba(52,45,39,0.18))",
                          }}>
                            <R {...props} scale={0.28} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Forside + bagside sammen */}
                  <div className="mt-4 w-full">
                    <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                      Forside + bagside
                    </div>
                    <div className="rounded-xl p-6 flex justify-center gap-4" style={{ background: PANEL_BG }}>
                      <div style={{ filter: "drop-shadow(0 12px 18px rgba(52,45,39,0.18))" }}>
                        <StorybookFront print={FRONT_SAMPLES[0].print} scale={0.5} scene="face" />
                      </div>
                      <div style={{ filter: "drop-shadow(0 12px 18px rgba(52,45,39,0.18))" }}>
                        <R {...props} scale={0.5} />
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        {/* -------------------- HISTORIK: Round 1 bagsider -------------------- */}
        <section>
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Historik · design_exploration</div>
            <h2 className="font-serif text-2xl mt-1">Round 1 bagsider (arkiveret)</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              De første tre studier bevares som reference. Vælg stadig kompatibel bagside globalt her.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {BACK_VARIANTS.map((v) => {
              const R = BACK_RENDERERS[v.id];
              const isMaster = masterBack === v.id;
              const props: CardBackProps = { scale: 0.85, brandName: brand.name, tagline: brand.tagline, showTagline };
              return (
                <div key={v.id} className="flex flex-col items-center">
                  <div className="font-serif text-lg mb-2">{v.name}</div>
                  <div className="rounded-xl p-6 flex justify-center" style={{ background: PANEL_BG }}>
                    <div style={{ filter: "drop-shadow(0 20px 30px rgba(52,45,39,0.16))" }}>
                      <R {...props} />
                    </div>
                  </div>
                  <Button variant={isMaster ? "default" : "outline"} className="mt-3" size="sm" onClick={() => chooseBack(v.id)}>
                    {isMaster ? (<><Check className="mr-2 h-4 w-4" /> Aktiv global bagside</>) : "Sæt som global"}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-8">
          Efter dette review vælger vi brandnavn, brandmark og bagside — først derefter fastlåses den globale identitet.
        </footer>
      </div>
    </div>
  );
}
