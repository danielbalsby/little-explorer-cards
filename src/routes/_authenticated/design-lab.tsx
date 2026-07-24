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
} from "@/components/card-variants/backs-round2";
import {
  BACK_V3_RENDERERS,
  BACK_V3_VARIANTS,
  type BackV3Variant,
} from "@/components/card-variants/backs-v3";
import {
  RELATION_MARK_VARIANTS,
  RelationMark,
  type RelationMarkVariant,
} from "@/components/card-variants/brandmarks-v2";
import {
  BRANDMARK_VARIANTS,
  Brandmark,
} from "@/components/card-variants/brandmarks";
import {
  MICRO_STORIES,
  MICRO_STORY_RENDERERS,
  type MicroStoryKey,
} from "@/components/card-variants/scenes-v2";
import type { PrintContent } from "@/lib/card-schema";
import { REFERENCE_CARD } from "@/lib/card-variants";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/design-lab")({
  head: () => ({
    meta: [
      { title: "Design-lab · Små Stunder · V5" },
      { name: "description", content: "Micro Story-illustrationer, ny relation-brandmark og Round 3 bagsider." },
      { property: "og:title", content: "Design-lab · Små Stunder" },
      { property: "og:description", content: "Beslutningsrum: 12 mikro-scener, tre nye brandmarks og fire nye bagsider." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignLab,
});

const PANEL_BG = "radial-gradient(120% 80% at 50% 20%, #F4EEDF 0%, #E6DDC9 100%)";
const WORKING_BRAND = "Små Stunder";

// -------- Build a print sample per micro story --------
function printFor(key: MicroStoryKey): PrintContent {
  const base = REFERENCE_CARD;
  const meta = MICRO_STORIES.find((m) => m.id === key)!;
  const map: Partial<Record<MicroStoryKey, Partial<PrintContent>>> = {
    face_to_face: { title: "Ansigt til ansigt" },
    soft_kicks: {
      title: "Bløde spark", age_group: "4-6m",
      development_areas: ["Motorik", "Krop", "Rytme"],
      intro: "En lille rytme mellem jeres hænder og babys fødder.",
      steps: [
        "Læg baby på ryggen, du sidder foran.",
        "Læg dine hænder blidt mod fodsålerne.",
        "Vent på et lille spark.",
        "Svar med et blidt modtryk.",
      ],
      look_for: "Hvis baby sparker igen, følg rytmen.",
      pause_if: "Baby stivner eller kigger væk.",
    },
    leaf_moving: {
      title: "Bladet der bevæger sig", age_group: "6-9m",
      development_areas: ["Sanser", "Opmærksomhed", "Natur"],
      intro: "Et blad, lidt vind, og et roligt sansemoment.",
      steps: [
        "Sæt jer ude eller ved et åbent vindue.",
        "Hold et blad frem for baby.",
        "Lad det blafre roligt i luften.",
        "Følg babys blik.",
      ],
      look_for: "Hvis baby følger bladet, bevæg det langsomt videre.",
      pause_if: "Baby vender sig væk eller trækker sig.",
    },
    words_we_see: {
      title: "Ord for det vi ser", age_group: "9-12m",
      development_areas: ["Sprog", "Fælles opmærksomhed"],
      intro: "En stille navngivning af hverdagens ting.",
      steps: [
        "Sæt jer sammen ved noget kendt.",
        "Peg på én ting.",
        "Sig ordet stille og tydeligt.",
        "Vent på babys reaktion.",
      ],
      look_for: "Hvis baby kigger med, gentag ordet.",
      pause_if: "Baby bliver træt eller urolig.",
    },
    changing_song: {
      title: "Puslebordets sang", age_group: "0-2m",
      development_areas: ["Tryghed", "Rytme", "Stemme"],
      intro: "En lille tone der binder hverdagens skift sammen.",
      steps: [
        "Læg baby blidt på puslebordet.",
        "Nyn den samme korte melodi hver gang.",
        "Bevæg dig roligt.",
        "Slut med et lille smil.",
      ],
      look_for: "Baby genkender melodien efter få dage.",
      pause_if: "Baby græder eller stivner.",
    },
    bath_time: {
      title: "Badestund", age_group: "2-4m",
      development_areas: ["Tryghed", "Sanser"],
      intro: "Vand, stemme og støttende hænder.",
      steps: [
        "Test vandet med albuen.",
        "Læg baby blidt i vandet, støt nakke og ryg.",
        "Nyn eller tal roligt.",
        "Vent på babys små reaktioner.",
      ],
      look_for: "Åbne håndflader og rolige træk.",
      pause_if: "Baby bliver stiv eller kold.",
    },
    tummy_play: {
      title: "Maveliggende leg", age_group: "2-4m",
      development_areas: ["Motorik", "Nakke", "Kontakt"],
      intro: "Kort tid på maven — sammen, ikke alene.",
      steps: [
        "Læg baby på maven på et blødt underlag.",
        "Læg dig i babys øjenhøjde.",
        "Smil eller lav en lille lyd.",
        "Slut inden baby bliver træt.",
      ],
      look_for: "Baby løfter hovedet et lille øjeblik.",
      pause_if: "Baby lægger hovedet ned og virker udmattet.",
    },
    reaching_object: {
      title: "Gribe efter genstand", age_group: "4-6m",
      development_areas: ["Motorik", "Øje-hånd"],
      intro: "Ét objekt inden for rækkevidde — vent på grebet.",
      steps: [
        "Sæt dig så baby ligger eller sidder trygt.",
        "Hold en let rangle stille i luften.",
        "Vent på at baby strækker sig.",
        "Svar med et blidt smil.",
      ],
      look_for: "Åbne fingre og målrettet strækning.",
      pause_if: "Baby taber interessen — læg objektet væk.",
    },
    singing_music: {
      title: "Sang og musik", age_group: "0-2m",
      development_areas: ["Sprog", "Stemme", "Tryghed"],
      intro: "Én kort sang — igen og igen.",
      steps: [
        "Hold baby tæt.",
        "Vælg én kort sang.",
        "Syng roligt og gentag.",
        "Vent på babys reaktion.",
      ],
      look_for: "Baby falder til ro eller lytter opmærksomt.",
      pause_if: "Baby vender sig væk.",
    },
    book_language: {
      title: "Bog og sprog", age_group: "6-9m",
      development_areas: ["Sprog", "Fælles opmærksomhed"],
      intro: "En robust bog og lidt tid sammen.",
      steps: [
        "Sæt jer bekvemt sammen.",
        "Åbn bogen og peg på ét billede.",
        "Navngiv det stille.",
        "Vent på babys blik eller lyd.",
      ],
      look_for: "Baby følger din finger.",
      pause_if: "Baby prøver at lukke bogen — det er nok.",
    },
    outdoor_walk: {
      title: "Udendørs gåtur", age_group: "4-6m",
      development_areas: ["Sanser", "Natur"],
      intro: "En rolig tur uden mål.",
      steps: [
        "Gå ad en kendt rute.",
        "Stop ved noget baby ser på.",
        "Sæt ord på i én sætning.",
        "Fortsæt roligt.",
      ],
      look_for: "Baby vender hovedet mod lyde.",
      pause_if: "Baby er træt eller kold.",
    },
    calm_on_arm: {
      title: "Rolig stund på armen", age_group: "0-2m",
      development_areas: ["Tryghed", "Regulering"],
      intro: "Bare stå tæt — ingen leg, ingen program.",
      steps: [
        "Hold baby mod din skulder.",
        "Ånd langsomt.",
        "Bevæg dig næsten ikke.",
        "Bliv til baby slipper.",
      ],
      look_for: "Babys krop bliver blødere.",
      pause_if: "Baby leder efter noget andet.",
    },
  };
  return {
    ...base,
    variations: [], did_you_know: "", safety: "", materials: "",
    ...map[key],
    title: map[key]?.title ?? meta.title,
  } as PrintContent;
}

function DesignLab() {
  const [masterBack, setMasterBack] = useState<BackVariant | null>(() => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem("master_card_back") as BackVariant | null) ?? null;
  });
  const [selectedMark, setSelectedMark] = useState<RelationMarkVariant>("two_profiles");
  const [selectedBackV3, setSelectedBackV3] = useState<BackV3Variant>("quiet_story");
  const [frontScale, setFrontScale] = useState(0.85);
  const [backScale, setBackScale] = useState(1.1);

  function chooseLegacyBack(v: BackVariant) {
    localStorage.setItem("master_card_back", v);
    setMasterBack(v);
  }

  const CurrentBack = BACK_V3_RENDERERS[selectedBackV3];

  return (
    <div className="min-h-screen" style={{ background: "#EFE9DE" }}>
      <div className="mx-auto max-w-[1600px] px-6 py-10 space-y-20">
        <header>
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Visuel system V5 · beslutningsrum
          </div>
          <h1 className="mt-1 font-serif text-4xl">Små Stunder · Design-lab</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Vi konsoliderer nu identiteten. Arbejdsbrand: <b>Små Stunder</b> (endnu ikke låst juridisk).
            Ingen tagline på bagsiden. Micro Story-illustrationer erstatter enkelt-symboler.
            Målet er at vælge brandmark, bagside og illustrationssystem — og fastlåse dem.
          </p>
        </header>

        {/* ============ DEL 1 · MICRO STORY ILLUSTRATION SYSTEM ============ */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Del 1</div>
              <h2 className="font-serif text-2xl mt-1">Micro Story · 12 kort</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mt-1">
                Hver illustration viser et lille øjeblik fra aktiviteten — ikke et symbol.
                Kun <i>Ansigt til ansigt</i> er Gold Standard reference for varme, streg, negativt rum og storytelling.
                Style lock er konstant. Komposition varierer.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Zoom</span>
              <input type="range" min={0.6} max={1.1} step={0.05}
                value={frontScale} onChange={(e) => setFrontScale(parseFloat(e.target.value))}
                className="w-32" />
              <span className="tabular-nums text-muted-foreground">{Math.round(frontScale * 100)}%</span>
            </div>
          </div>

          <div className="rounded-2xl p-8 overflow-x-auto" style={{ background: PANEL_BG }}>
            <div className="grid gap-10 justify-items-center" style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}>
              {MICRO_STORIES.map((m) => {
                const Scene = MICRO_STORY_RENDERERS[m.id];
                return (
                  <div key={m.id} className="flex flex-col items-center gap-3 max-w-[300px]">
                    <div style={{ filter: "drop-shadow(0 20px 30px rgba(52,45,39,0.16))", position: "relative" }}>
                      {m.is_gold && (
                        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-[#342D27] px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#F8F4EC]">
                          Gold
                        </div>
                      )}
                      <StorybookFront print={printFor(m.id)} scale={frontScale} sceneComponent={Scene} />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {m.title} · <span className="normal-case tracking-normal">{m.composition.replace(/_/g, " ")}</span>
                    </div>
                    <details className="text-[11px] text-muted-foreground max-w-[260px]">
                      <summary className="cursor-pointer">Illustrationsbrief</summary>
                      <p className="mt-2">{m.brief}</p>
                      <p className="mt-2 italic">{m.elements.join(" · ")}</p>
                    </details>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Micro Story Sheet — 12 scener uden tekst */}
          <div className="mt-8">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              Illustration Sheet · konsistens-test (uden tekst)
            </div>
            <div className="rounded-2xl p-8" style={{ background: PANEL_BG }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {MICRO_STORIES.map((m) => {
                  const Scene = MICRO_STORY_RENDERERS[m.id];
                  return (
                    <div key={m.id} className="flex flex-col items-center gap-2">
                      <div style={{
                        width: "100%", aspectRatio: "300 / 180",
                        background: "#F8F4EC",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 8px 20px -8px rgba(52,45,39,0.2)",
                      }}>
                        <Scene />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                        {m.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============ DEL 2 · NEW RELATION BRANDMARK ============ */}
        <section>
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Del 2</div>
            <h2 className="font-serif text-2xl mt-1">Ny brandmark-retning · voksen + barn + et lille svar</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              De tidligere Relation/Moment/Together bevares som design_exploration. Her testes tre nye
              symbolstudier bygget på DNA'et fra <i>Ansigt til ansigt</i> — uden infinity, uden hjerter.
            </p>
          </div>

          <div className="rounded-2xl p-8" style={{ background: PANEL_BG }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {RELATION_MARK_VARIANTS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMark(m.id)}
                  className="rounded-xl bg-white/80 p-8 flex flex-col items-center gap-4 hover:bg-white transition"
                  style={{ outline: selectedMark === m.id ? "2px solid #342D27" : "none" }}
                >
                  <RelationMark variant={m.id} size={28} />
                  <div className="text-center">
                    <div className="font-serif text-lg">{m.name}</div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">
                      {m.description}
                    </div>
                  </div>
                  {/* Størrelses-test */}
                  <div className="flex items-end gap-4 mt-3">
                    <RelationMark variant={m.id} size={14} />
                    <RelationMark variant={m.id} size={10} />
                    <RelationMark variant={m.id} size={7} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============ DEL 3 · BACK ROUND 3 ============ */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Del 3</div>
              <h2 className="font-serif text-2xl mt-1">Bagside · Round 3 · uden tagline</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mt-1">
                Fire nye bagsider — bygget på "Små Stunder + relation + ro + storybook". Ingen abstrakt dekoration.
                Testes med <b>{RELATION_MARK_VARIANTS.find((m) => m.id === selectedMark)?.name}</b>.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Zoom</span>
              <input type="range" min={0.7} max={1.4} step={0.05}
                value={backScale} onChange={(e) => setBackScale(parseFloat(e.target.value))}
                className="w-32" />
              <span className="tabular-nums text-muted-foreground">{Math.round(backScale * 100)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {BACK_V3_VARIANTS.map((v) => {
              const R = BACK_V3_RENDERERS[v.id];
              const isActive = selectedBackV3 === v.id;
              const props = { scale: backScale, brandName: WORKING_BRAND, brandmark: selectedMark };
              return (
                <section key={v.id}
                  className="rounded-2xl p-6 flex flex-col items-center"
                  style={{
                    background: PANEL_BG,
                    outline: isActive ? "2px solid #342D27" : "none",
                  }}>
                  <div className="mb-4 w-full text-center">
                    <div className="font-serif text-xl">{v.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">{v.description}</div>
                  </div>

                  <div className="flex justify-center py-4">
                    <div style={{ filter: "drop-shadow(0 30px 40px rgba(52,45,39,0.18))" }}>
                      <R {...props} />
                    </div>
                  </div>

                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="mt-2"
                    onClick={() => setSelectedBackV3(v.id)}
                  >
                    {isActive ? (<><Check className="mr-2 h-4 w-4" /> Valgt til produkttest</>) : "Vælg til produkttest"}
                  </Button>
                </section>
              );
            })}
          </div>
        </section>

        {/* ============ DEL 4 · PRODUCT CONTEXT (chosen back + mark) ============ */}
        <section>
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Del 4</div>
            <h2 className="font-serif text-2xl mt-1">Produkt-kontekst · {WORKING_BRAND}</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              Det valgte brandmark ({RELATION_MARK_VARIANTS.find((m) => m.id === selectedMark)?.name})
              og den valgte bagside ({BACK_V3_VARIANTS.find((v) => v.id === selectedBackV3)?.name})
              vist på tværs af produktet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enkelt kort */}
            <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Ét kort</div>
              <div style={{ filter: "drop-shadow(0 30px 40px rgba(52,45,39,0.18))" }}>
                <CurrentBack scale={1.1} brandName={WORKING_BRAND} brandmark={selectedMark} />
              </div>
            </div>

            {/* Front + back par */}
            <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Forside + bagside</div>
              <div className="flex gap-6">
                <div style={{ filter: "drop-shadow(0 20px 30px rgba(52,45,39,0.18))" }}>
                  <StorybookFront
                    print={printFor("face_to_face")}
                    scale={0.6}
                    sceneComponent={MICRO_STORY_RENDERERS.face_to_face}
                  />
                </div>
                <div style={{ filter: "drop-shadow(0 20px 30px rgba(52,45,39,0.18))" }}>
                  <CurrentBack scale={0.6} brandName={WORKING_BRAND} brandmark={selectedMark} />
                </div>
              </div>
            </div>

            {/* En bunke */}
            <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">En bunke</div>
              <div className="relative" style={{ width: 340, height: 300 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: i * 6, top: i * 4,
                    transform: `rotate(${(i - 2) * 2}deg)`,
                    filter: "drop-shadow(0 12px 18px rgba(52,45,39,0.16))",
                    zIndex: i,
                  }}>
                    <CurrentBack scale={0.65} brandName={WORKING_BRAND} brandmark={selectedMark} />
                  </div>
                ))}
              </div>
            </div>

            {/* 10 spredt */}
            <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">10 spredte kort</div>
              <div className="relative overflow-hidden" style={{ width: 380, height: 260 }}>
                {Array.from({ length: 10 }).map((_, i) => {
                  const angle = ((i * 43) % 40) - 20;
                  const x = (i * 61) % 300;
                  const y = 10 + ((i * 37) % 120);
                  return (
                    <div key={i} style={{
                      position: "absolute", left: x, top: y,
                      transform: `rotate(${angle}deg)`,
                      filter: "drop-shadow(0 8px 12px rgba(52,45,39,0.18))",
                    }}>
                      <CurrentBack scale={0.28} brandName={WORKING_BRAND} brandmark={selectedMark} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Æske-front */}
            <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Æske · forside</div>
              <div style={{
                width: 320, height: 220,
                background: "#F1EADB",
                borderRadius: 12,
                boxShadow: "0 30px 40px rgba(52,45,39,0.18), inset 0 0 0 1px rgba(52,45,39,0.06)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 18,
                padding: 28,
                position: "relative",
              }}>
                <RelationMark variant={selectedMark} size={26} />
                <div style={{
                  fontFamily: "'Fraunces', 'Cormorant Garamond', serif",
                  fontSize: "26pt", fontWeight: 500, letterSpacing: "0.02em", color: "#342D27",
                }}>{WORKING_BRAND}</div>
                <div style={{
                  fontSize: "9pt", letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "#342D27AA",
                }}>Aktivitetskort til det første år</div>
              </div>
            </div>

            {/* Website-logo */}
            <div className="rounded-2xl p-8 flex flex-col items-center justify-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Lille website-logo</div>
              <div style={{
                background: "#FFFFFF",
                borderRadius: 999,
                padding: "10px 20px",
                display: "flex", alignItems: "center", gap: 10,
                boxShadow: "0 6px 14px rgba(52,45,39,0.12)",
              }}>
                <RelationMark variant={selectedMark} size={9} />
                <div style={{
                  fontFamily: "'Fraunces', 'Cormorant Garamond', serif",
                  fontSize: "14pt", fontWeight: 500, color: "#342D27",
                }}>{WORKING_BRAND}</div>
              </div>

              {/* 180° rotationstest */}
              <div className="mt-8 text-[10px] uppercase tracking-widest text-muted-foreground">Bagside · 180° test</div>
              <div className="mt-3" style={{ transform: "rotate(180deg)", filter: "drop-shadow(0 12px 18px rgba(52,45,39,0.18))" }}>
                <CurrentBack scale={0.45} brandName={WORKING_BRAND} brandmark={selectedMark} />
              </div>
            </div>
          </div>
        </section>

        {/* ============ ARKIV · brandmarks Round 1 + backs Round 1/2 ============ */}
        <section>
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Arkiv · design_exploration
            </div>
            <h2 className="font-serif text-2xl mt-1">Tidligere retninger bevares som reference</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              Ingen nye retninger tilføjes efter denne iteration. De tidligere studier holdes tilgængelige for at
              dokumentere valget, men indgår ikke længere som aktive kandidater.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Brandmarks Round 1 */}
            <div className="rounded-2xl p-6" style={{ background: PANEL_BG }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Brandmarks · Round 1 (arkiveret)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {BRANDMARK_VARIANTS.map((m) => (
                  <div key={m.id} className="bg-white/70 rounded-xl p-4 flex flex-col items-center gap-2">
                    <Brandmark variant={m.id} size={16} />
                    <div className="font-serif text-sm text-center">{m.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backs Round 2 */}
            <div className="rounded-2xl p-6" style={{ background: PANEL_BG }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Bagside · Round 2 (arkiveret)
              </div>
              <div className="grid grid-cols-3 gap-3">
                {BACK_ROUND2_VARIANTS.map((v) => {
                  const R = BACK_ROUND2_RENDERERS[v.id];
                  return (
                    <div key={v.id} className="flex flex-col items-center gap-2">
                      <div style={{ filter: "drop-shadow(0 8px 12px rgba(52,45,39,0.16))" }}>
                        <R scale={0.4} brandName={WORKING_BRAND} showTagline={false} />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                        {v.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Round 1 backs — bevaret som legacy global master back-vælger */}
          <div className="mt-8 rounded-2xl p-6" style={{ background: PANEL_BG }}>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
              Bagside · Round 1 (kan stadig sættes som legacy global master)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {BACK_VARIANTS.map((v) => {
                const R = BACK_RENDERERS[v.id];
                const isMaster = masterBack === v.id;
                const props: CardBackProps = { scale: 0.55, brandName: WORKING_BRAND, showTagline: false };
                return (
                  <div key={v.id} className="flex flex-col items-center">
                    <div className="font-serif text-sm mb-2">{v.name}</div>
                    <div style={{ filter: "drop-shadow(0 12px 18px rgba(52,45,39,0.16))" }}>
                      <R {...props} />
                    </div>
                    <Button
                      variant={isMaster ? "default" : "outline"}
                      className="mt-3" size="sm"
                      onClick={() => chooseLegacyBack(v.id)}
                    >
                      {isMaster ? (<><Check className="mr-2 h-4 w-4" /> Aktiv legacy master</>) : "Sæt som legacy master"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-8 pb-4">
          Stop-kriterium: Efter denne iteration laves ingen nye visuelle retninger.
          Vi vælger brandmark, bagside og illustrationssystem — og fastlåser identiteten.
        </footer>
      </div>
    </div>
  );
}
