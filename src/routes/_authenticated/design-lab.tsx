import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StorybookFront } from "@/components/card-variants/storybook";
import {
  BACK_RENDERERS,
  BACK_VARIANTS,
  type BackVariant,
  type CardBackProps,
} from "@/components/card-variants/backs";
import type { PrintContent } from "@/lib/card-schema";
import { REFERENCE_CARD } from "@/lib/card-variants";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/design-lab")({
  head: () => ({
    meta: [
      { title: "Design-lab · Babykort" },
      {
        name: "description",
        content:
          "Fastlås forsidefamilien og vælg den permanente bagside for det fysiske babykort-system.",
      },
      { property: "og:title", content: "Design-lab · Babykort" },
      {
        property: "og:description",
        content: "5 testforsider i Minimal Storybook + 3 forslag til én fast bagside.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignLab,
});

// ---------- 5 testforsider (Minimal Storybook som fastlåst master) ----------

const FRONT_SAMPLES: Array<{ label: string; print: PrintContent }> = [
  {
    label: "Rolig kontakt",
    print: REFERENCE_CARD,
  },
  {
    label: "Motorik",
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
  },
  {
    label: "Natur",
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
      did_you_know: "",
      safety: "",
      materials: "",
    },
  },
  {
    label: "Sprog",
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
      did_you_know: "",
      safety: "",
      materials: "",
    },
  },
  {
    label: "Hverdag",
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
      did_you_know: "",
      safety: "",
      materials: "",
    },
  },
];

// ---------- Vurderingskriterier for bagside ----------

const BACK_CRITERIA: Array<{ id: string; label: string }> = [
  { id: "recognition", label: "Genkendelighed" },
  { id: "calm", label: "Ro" },
  { id: "premium", label: "Premium-følelse" },
  { id: "timeless", label: "Tidløshed" },
  { id: "printable", label: "Print-egnethed" },
  { id: "stack", label: "Fungerer i en bunke" },
];

type Scores = Record<string, number>;

function DesignLab() {
  const [masterBack, setMasterBack] = useState<BackVariant | null>(() => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem("master_card_back") as BackVariant | null) ?? null;
  });
  const [brandName] = useState("Babykort");
  const [tagline, setTagline] = useState("Små stunder sammen");
  const [showTagline, setShowTagline] = useState(true);
  const [frontScale, setFrontScale] = useState(0.9);
  const [backScale, setBackScale] = useState(1.15);
  const [scores, setScores] = useState<Record<BackVariant, Scores>>({
    iconic_minimal: {},
    storybook_emblem: {},
    organic_pattern: {},
  });

  function chooseBack(v: BackVariant) {
    localStorage.setItem("master_card_back", v);
    setMasterBack(v);
  }

  function setScore(v: BackVariant, criterion: string, value: number) {
    setScores((prev) => ({ ...prev, [v]: { ...prev[v], [criterion]: value } }));
  }

  return (
    <div className="min-h-screen" style={{ background: "#EFE9DE" }}>
      <div className="mx-auto max-w-[1600px] px-6 py-10 space-y-20">
        <header className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Fastlås det fysiske kortsystem
            </div>
            <h1 className="mt-1 font-serif text-4xl">Design-lab</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Forsidefamilien er låst til <em>Minimal Storybook</em>. Vælg den permanente
              bagside — den vil være ens på alle kort og fungere som seriens visuelle
              signatur. Valget gemmes som{" "}
              <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">master_card_back</code>.
            </p>
          </div>
        </header>

        {/* -------------------- FORSIDEFAMILIE -------------------- */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Del 1
              </div>
              <h2 className="font-serif text-2xl mt-1">Forsidefamilien · 5 testkort</h2>
              <p className="text-sm text-muted-foreground max-w-xl mt-1">
                Samme layoutgrundlag, forskellige aktiviteter. Kortene skal føles
                beslægtede — ikke identiske.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Zoom</span>
              <input
                type="range"
                min={0.7}
                max={1.2}
                step={0.05}
                value={frontScale}
                onChange={(e) => setFrontScale(parseFloat(e.target.value))}
                className="w-32"
              />
              <span className="tabular-nums text-muted-foreground">
                {Math.round(frontScale * 100)}%
              </span>
            </div>
          </div>

          <div
            className="rounded-2xl p-8 overflow-x-auto"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 20%, #F4EEDF 0%, #E6DDC9 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            <div className="flex flex-wrap gap-8 justify-center items-start">
              {FRONT_SAMPLES.map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-3">
                  <div style={{ filter: "drop-shadow(0 20px 30px rgba(52,45,39,0.16))" }}>
                    <StorybookFront print={f.print} scale={frontScale} />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------- BAGSIDEFORSLAG -------------------- */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Del 2
              </div>
              <h2 className="font-serif text-2xl mt-1">Én fast bagside · 3 forslag</h2>
              <p className="text-sm text-muted-foreground max-w-xl mt-1">
                Samme bagside bruges på alle kort. Vurder hvert forslag isoleret,
                i en lille gruppe og som bunke.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showTagline}
                  onChange={(e) => setShowTagline(e.target.checked)}
                />
                <span>Vis tagline</span>
              </label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="rounded border border-black/10 bg-white/60 px-2 py-1 w-56"
                placeholder="Tagline"
              />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Zoom</span>
                <input
                  type="range"
                  min={0.9}
                  max={1.5}
                  step={0.05}
                  value={backScale}
                  onChange={(e) => setBackScale(parseFloat(e.target.value))}
                  className="w-32"
                />
                <span className="tabular-nums text-muted-foreground">
                  {Math.round(backScale * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {BACK_VARIANTS.map((v) => {
              const R = BACK_RENDERERS[v.id];
              const isMaster = masterBack === v.id;
              const props: CardBackProps = {
                scale: backScale,
                brandName,
                tagline,
                showTagline,
              };
              return (
                <section key={v.id} className="flex flex-col items-center">
                  <div className="mb-4 w-full text-center">
                    <div className="font-serif text-xl">{v.name}</div>
                    <div className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
                      {v.tagline}
                    </div>
                  </div>

                  {/* Ét kort */}
                  <div
                    className="rounded-2xl p-8 w-full flex justify-center"
                    style={{
                      background:
                        "radial-gradient(120% 80% at 50% 20%, #F4EEDF 0%, #E6DDC9 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    }}
                  >
                    <div style={{ filter: "drop-shadow(0 30px 40px rgba(52,45,39,0.18))" }}>
                      <R {...props} />
                    </div>
                  </div>

                  <p className="mt-4 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>

                  {/* 10 spredte kort */}
                  <div className="mt-6 w-full">
                    <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                      10 kort spredt
                    </div>
                    <div
                      className="rounded-2xl p-6 relative overflow-hidden"
                      style={{
                        background:
                          "radial-gradient(120% 80% at 50% 20%, #F4EEDF 0%, #E6DDC9 100%)",
                        height: 220,
                      }}
                    >
                      {Array.from({ length: 10 }).map((_, i) => {
                        const angle = ((i * 37) % 40) - 20;
                        const x = (i * 53) % 260;
                        const y = 10 + ((i * 29) % 90);
                        return (
                          <div
                            key={i}
                            style={{
                              position: "absolute",
                              left: x,
                              top: y,
                              transform: `rotate(${angle}deg)`,
                              filter:
                                "drop-shadow(0 8px 12px rgba(52,45,39,0.18))",
                            }}
                          >
                            <R {...props} scale={0.28} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bunke */}
                  <div className="mt-6 w-full">
                    <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                      Bunke (20 kort)
                    </div>
                    <div
                      className="rounded-2xl p-6 relative flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(120% 80% at 50% 20%, #F4EEDF 0%, #E6DDC9 100%)",
                        height: 200,
                      }}
                    >
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            transform: `translate(${(i - 10) * 0.6}px, ${(i - 10) * 0.4}px) rotate(${((i * 13) % 6) - 3}deg)`,
                            filter:
                              i === 19
                                ? "drop-shadow(0 12px 18px rgba(52,45,39,0.28))"
                                : "none",
                          }}
                        >
                          <R {...props} scale={0.45} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vurderingskriterier */}
                  <div className="mt-6 w-full space-y-2">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                      Din vurdering (1–5)
                    </div>
                    <div className="rounded-xl border bg-white/50 p-4 space-y-2">
                      {BACK_CRITERIA.map((c) => {
                        const value = scores[v.id][c.id] ?? 0;
                        return (
                          <div key={c.id} className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-muted-foreground">{c.label}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => setScore(v.id, c.id, n)}
                                  className="h-6 w-6 rounded-full border text-xs tabular-nums"
                                  style={{
                                    background: value >= n ? "var(--foreground)" : "transparent",
                                    color: value >= n ? "var(--background)" : "inherit",
                                    borderColor: "rgba(0,0,0,0.15)",
                                  }}
                                  aria-label={`${c.label} ${n}`}
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    variant={isMaster ? "default" : "outline"}
                    className="mt-5"
                    onClick={() => chooseBack(v.id)}
                  >
                    {isMaster ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Valgt som fast bagside
                      </>
                    ) : (
                      "Vælg som fast bagside"
                    )}
                  </Button>
                </section>
              );
            })}
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-8">
          Når bagsiden er valgt, låses det fysiske kortsystem. Herefter flyttes fokus
          fra visuel udforskning til kortkvalitet, redaktionel konsistens og printtest.
        </footer>
      </div>
    </div>
  );
}
