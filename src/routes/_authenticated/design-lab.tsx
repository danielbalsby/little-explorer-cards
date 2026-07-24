import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StorybookFront } from "@/components/card-variants/storybook";
import {
  BACK_V3_RENDERERS,
  BACK_V3_VARIANTS,
} from "@/components/card-variants/backs-v3";
import {
  R1_VARIANTS,
  R1Mark,
  type R1Variant,
} from "@/components/card-variants/brandmarks-v6";
import {
  RELATION_MARK_VARIANTS,
  RelationMark,
} from "@/components/card-variants/brandmarks-v2";
import {
  BRANDMARK_VARIANTS,
  Brandmark,
} from "@/components/card-variants/brandmarks";
import { BACK_ROUND2_RENDERERS, BACK_ROUND2_VARIANTS } from "@/components/card-variants/backs-round2";
import { BACK_RENDERERS, BACK_VARIANTS } from "@/components/card-variants/backs";
import {
  MICRO_STORIES,
  MICRO_STORY_RENDERERS,
} from "@/components/card-variants/scenes-v2";
import {
  CATEGORY_SCENES,
} from "@/components/card-variants/category-illustrations";
import {
  VISUAL_CATEGORY_LIST,
  type VisualCategory,
} from "@/lib/visual-categories";
import type { PrintContent, AgeGroup } from "@/lib/card-schema";
import { REFERENCE_CARD } from "@/lib/card-variants";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/design-lab")({
  head: () => ({
    meta: [
      { title: "Design-lab · Små Stunder · V6" },
      { name: "description", content: "Beslutningsrum: 10 kategoriillustrationer + R1 Gold-logo refinement." },
      { property: "og:title", content: "Design-lab · Små Stunder · V6" },
      { property: "og:description", content: "Category illustration system og R1-logo bygget direkte på Ansigt til ansigt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignLab,
});

const PANEL_BG = "radial-gradient(120% 80% at 50% 20%, #F4EEDF 0%, #E6DDC9 100%)";
const WORKING_BRAND = "Små Stunder";

/** Sample-tekst pr. kategori — én "hero"-titel og én "søster"-titel så gentagelse er synlig. */
type SampleCard = {
  category: VisualCategory;
  title: string;
  age: AgeGroup;
  areas: string[];
  intro: string;
  steps: string[];
};

const SAMPLE_CARDS: SampleCard[] = [
  { category: "naerhed_samspil", title: "Ansigt til ansigt", age: "2-4m", areas: ["Kontakt", "Mimik", "Turtagning"],
    intro: "En enkel kontaktleg med ansigt, lyd og pauser.",
    steps: ["Sæt jer tæt.", "Smil eller lav en lille lyd.", "Vent et øjeblik.", "Svar på babys blik."] },
  { category: "naerhed_samspil", title: "Smil og svar", age: "2-4m", areas: ["Kontakt", "Turtagning"],
    intro: "Lidt tid til at bytte små smil.",
    steps: ["Sæt jer over for hinanden.", "Send et roligt smil.", "Vent på babys svar."] },
  { category: "krop_bevaegelse", title: "Bløde spark", age: "4-6m", areas: ["Motorik", "Krop", "Rytme"],
    intro: "En lille rytme mellem jeres hænder og babys fødder.",
    steps: ["Læg baby på ryggen.", "Læg hænderne mod fodsålerne.", "Vent på et lille spark.", "Svar med blidt modtryk."] },
  { category: "krop_bevaegelse", title: "Maveliggende leg", age: "2-4m", areas: ["Motorik", "Nakke"],
    intro: "Kort tid på maven — sammen, ikke alene.",
    steps: ["Læg baby på maven.", "Læg dig i øjenhøjde.", "Smil eller lav en lyd."] },
  { category: "haender_nysgerrighed", title: "Gribe efter genstand", age: "4-6m", areas: ["Motorik", "Øje-hånd"],
    intro: "Ét objekt inden for rækkevidde — vent på grebet.",
    steps: ["Hold rangle stille i luften.", "Vent på strækning.", "Svar med et blidt smil."] },
  { category: "haender_nysgerrighed", title: "Første rangle", age: "4-6m", areas: ["Motorik", "Sanser"],
    intro: "En lille rangle at møde med hænderne.",
    steps: ["Læg rangle i babys hånd.", "Vent på babys reaktion.", "Følg lyden sammen."] },
  { category: "sanser_opdagelse", title: "Bladet der bevæger sig", age: "6-9m", areas: ["Sanser", "Natur"],
    intro: "Et blad, lidt vind, og et roligt sansemoment.",
    steps: ["Hold bladet frem.", "Lad det blafre roligt.", "Følg babys blik."] },
  { category: "sanser_opdagelse", title: "Blødt og hårdt", age: "6-9m", areas: ["Sanser", "Berøring"],
    intro: "To materialer med tydeligt forskellig tekstur.",
    steps: ["Læg to ting frem.", "Lad baby røre begge.", "Sæt ord på: blødt, hårdt."] },
  { category: "sprog_samtale", title: "Ord for det vi ser", age: "9-12m", areas: ["Sprog", "Fælles opmærksomhed"],
    intro: "En stille navngivning af hverdagens ting.",
    steps: ["Peg på én ting.", "Sig ordet tydeligt.", "Vent på babys reaktion."] },
  { category: "sprog_samtale", title: "Bog og sprog", age: "6-9m", areas: ["Sprog", "Fælles opmærksomhed"],
    intro: "En robust bog og lidt tid sammen.",
    steps: ["Åbn bogen.", "Navngiv ét billede.", "Vent på babys lyd."] },
  { category: "musik_rytme", title: "Sang og musik", age: "0-2m", areas: ["Sprog", "Stemme", "Tryghed"],
    intro: "Én kort sang — igen og igen.",
    steps: ["Hold baby tæt.", "Vælg én kort sang.", "Syng roligt.", "Vent på reaktion."] },
  { category: "musik_rytme", title: "Puslebordets sang", age: "0-2m", areas: ["Rytme", "Stemme"],
    intro: "En lille tone der binder skiftet sammen.",
    steps: ["Læg baby blidt ned.", "Nyn samme melodi.", "Bevæg dig roligt."] },
  { category: "natur_udeliv", title: "Udendørs gåtur", age: "4-6m", areas: ["Sanser", "Natur"],
    intro: "En rolig tur uden mål.",
    steps: ["Gå ad kendt rute.", "Stop ved noget baby ser på.", "Sæt ord på i én sætning."] },
  { category: "natur_udeliv", title: "Vind i træet", age: "6-9m", areas: ["Sanser", "Natur"],
    intro: "Kig sammen på det der bevæger sig.",
    steps: ["Sæt jer under et træ.", "Vent på et vindpust.", "Peg og navngiv."] },
  { category: "hverdagsstunder", title: "Skift med sang", age: "0-2m", areas: ["Tryghed", "Rytme"],
    intro: "Puslebordet bliver til en lille kendt melodi.",
    steps: ["Læg baby blidt.", "Nyn samme melodi.", "Bevæg dig langsomt."] },
  { category: "hverdagsstunder", title: "Badestund", age: "2-4m", areas: ["Tryghed", "Sanser"],
    intro: "Vand, stemme og støttende hænder.",
    steps: ["Test vandet.", "Læg baby blidt i.", "Nyn roligt."] },
  { category: "ro_tryghed", title: "Rolig stund på armen", age: "0-2m", areas: ["Tryghed", "Regulering"],
    intro: "Bare stå tæt — ingen leg, ingen program.",
    steps: ["Hold baby mod skulderen.", "Ånd langsomt.", "Bevæg dig næsten ikke."] },
  { category: "ro_tryghed", title: "Åndedrættet sammen", age: "2-4m", areas: ["Tryghed", "Regulering"],
    intro: "Læn dig ind og lyt til jeres to åndedræt.",
    steps: ["Hold baby tæt.", "Ånd langsommere.", "Vent på babys ro."] },
  { category: "leg_udforskning", title: "Tårnet der falder", age: "9-12m", areas: ["Leg", "Motorik"],
    intro: "En kort leg med to klodser og et smil når det falder.",
    steps: ["Byg to klodser sammen.", "Vent på babys hånd.", "Grin sammen når det falder."] },
  { category: "leg_udforskning", title: "Skjul og find", age: "9-12m", areas: ["Leg", "Kognition"],
    intro: "Et lille objekt der forsvinder og kommer igen.",
    steps: ["Skjul en klods under en klud.", "Vent på babys reaktion.", "Vis den igen."] },

  /* Runde 2: sværere/kant-titler pr. kategori — tester at scenen holder */
  { category: "naerhed_samspil", title: "Rolig nærhed", age: "0-2m", areas: ["Kontakt", "Regulering"],
    intro: "Bare være tæt — uden program.", steps: ["Sæt jer tæt.", "Vær stille.", "Følg babys blik."] },
  { category: "krop_bevaegelse", title: "Rul mig blidt", age: "6-9m", areas: ["Motorik", "Balance"],
    intro: "Et blidt rul mellem to positioner.", steps: ["Læg baby på ryggen.", "Støt hoften.", "Rul roligt til siden."] },
  { category: "haender_nysgerrighed", title: "Hånd i hånd", age: "2-4m", areas: ["Kontakt", "Motorik"],
    intro: "Babys hånd møder din finger.", steps: ["Tilbyd din finger.", "Vent på grebet.", "Bliv i berøringen."] },
  { category: "sanser_opdagelse", title: "Lysdans", age: "4-6m", areas: ["Sanser", "Syn"],
    intro: "Blødt lys der bevæger sig langsomt.", steps: ["Skab blødt lys.", "Bevæg det roligt.", "Følg babys blik."] },
  { category: "sprog_samtale", title: "Første ord", age: "9-12m", areas: ["Sprog"],
    intro: "Ét ord — gentaget varmt.", steps: ["Vælg ét kendt ord.", "Sig det tydeligt.", "Vent på svar."] },
  { category: "musik_rytme", title: "Klap og syng", age: "6-9m", areas: ["Rytme", "Motorik"],
    intro: "En kort rytme sammen.", steps: ["Syng samme sang.", "Klap i takt.", "Stop og vent."] },
  { category: "natur_udeliv", title: "Første regn", age: "6-9m", areas: ["Sanser", "Natur"],
    intro: "Regnen på hånden — første gang.", steps: ["Gå ud sammen.", "Ræk hånden frem.", "Sæt ord på."] },
  { category: "hverdagsstunder", title: "Bordet er dækket", age: "9-12m", areas: ["Rutiner", "Sprog"],
    intro: "En rolig overgang til måltidet.", steps: ["Fortæl hvad du gør.", "Vent på babys blik.", "Sæt jer sammen."] },
  { category: "ro_tryghed", title: "Puttetid", age: "4-6m", areas: ["Tryghed", "Søvn"],
    intro: "Samme lille rutine hver aften.", steps: ["Dæmp lyset.", "Nyn samme melodi.", "Bliv til baby falder til ro."] },
  { category: "leg_udforskning", title: "Klods på klods", age: "9-12m", areas: ["Leg", "Motorik"],
    intro: "To klodser — og en pause imellem.", steps: ["Læg én klods frem.", "Vent på babys hånd.", "Læg den anden ved siden af."] },
];

/* ============ Approval state (per-category lock) ============ */
const APPROVAL_KEY = "design-lab-v6-category-approvals";
function useCategoryApprovals() {
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(APPROVAL_KEY);
      if (raw) setApproved(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  const toggle = (id: string) => {
    setApproved((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(APPROVAL_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  return { approved, toggle };
}

function printFrom(s: SampleCard): PrintContent {
  return {
    ...REFERENCE_CARD,
    title: s.title,
    age_group: s.age,
    development_areas: s.areas,
    intro: s.intro,
    steps: s.steps,
    materials: "", variations: [], look_for: "", pause_if: "", did_you_know: "", safety: "",
  };
}

function DesignLab() {
  const [selectedR1, setSelectedR1] = useState<R1Variant>("r1a_baseline");
  const [selectedBackV3] = useState(BACK_V3_VARIANTS[0]?.id ?? "quiet_story");
  const [sheetScale, setSheetScale] = useState(1);

  return (
    <div className="min-h-screen" style={{ background: "#EFE9DE" }}>
      <div className="mx-auto max-w-[1600px] px-6 py-10 space-y-20">
        <header>
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Visuel system V6 · beslutningsrum
          </div>
          <h1 className="mt-1 font-serif text-4xl">Små Stunder · Design-lab</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Vi stopper unik-illustration pr. kort. Ny model: <b>Brand → Kategori → Kort</b>.
            10 kategoriillustrationer bæres af hele produktet. Kort deler illustration inden for kategori
            og skiller sig ud på titel, alder og handling. I denne iteration vurderes kun to ting:
            <b> A) de 10 kategoriillustrationer</b> og <b>B) R1-logo refinement</b>.
            Bagside H5 og global lock håndteres separat.
          </p>
        </header>

        {/* ============ A · 10 CATEGORY ILLUSTRATIONS ============ */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Beslutning A</div>
              <h2 className="font-serif text-2xl mt-1">10 kategoriillustrationer</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mt-1">
                Én illustration pr. kategori. Micro-story — ikke ikoner. Fælles streg, palette og negativt rum;
                fri variation i komposition (profil, top-down, environment, crop). Ansigt til ansigt bæres
                videre som "Nærhed &amp; samspil".
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Kort-zoom</span>
              <input type="range" min={0.6} max={1.2} step={0.05}
                value={sheetScale} onChange={(e) => setSheetScale(parseFloat(e.target.value))}
                className="w-32" />
              <span className="tabular-nums text-muted-foreground">{Math.round(sheetScale * 100)}%</span>
            </div>
          </div>

          {/* A1 — Illustration Sheet (uden tekst) */}
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              A1 · Illustration sheet · uden tekst
            </div>
            <div className="rounded-2xl p-8" style={{ background: PANEL_BG }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {VISUAL_CATEGORY_LIST.map((cat) => {
                  const Scene = CATEGORY_SCENES[cat.id];
                  return (
                    <div key={cat.id} className="flex flex-col items-center gap-2">
                      <div style={{
                        width: "100%", aspectRatio: "300 / 180",
                        background: "#F8F4EC", borderRadius: 12, overflow: "hidden",
                        boxShadow: "0 8px 20px -8px rgba(52,45,39,0.2)",
                      }}>
                        <Scene />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                        {cat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* A2 — På samme kortlayout (ét pr. kategori) */}
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              A2 · På kortlayout · ét kort pr. kategori
            </div>
            <div className="rounded-2xl p-8 overflow-x-auto" style={{ background: PANEL_BG }}>
              <div className="grid gap-8 justify-items-center" style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              }}>
                {VISUAL_CATEGORY_LIST.map((cat) => {
                  const sample = SAMPLE_CARDS.find((s) => s.category === cat.id)!;
                  const Scene = CATEGORY_SCENES[cat.id];
                  return (
                    <div key={cat.id} className="flex flex-col items-center gap-3">
                      <div style={{ filter: "drop-shadow(0 20px 30px rgba(52,45,39,0.16))" }}>
                        <StorybookFront print={printFrom(sample)} scale={sheetScale * 0.9} sceneComponent={Scene} />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                        {cat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* A3 — Thumbnails */}
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              A3 · Thumbnails · genkendelighed ved lav størrelse
            </div>
            <div className="rounded-2xl p-8 flex flex-wrap gap-4 items-end" style={{ background: PANEL_BG }}>
              {VISUAL_CATEGORY_LIST.map((cat) => {
                const Scene = CATEGORY_SCENES[cat.id];
                return (
                  <div key={cat.id} className="flex flex-col items-center gap-1">
                    <div style={{
                      width: 96, height: 58,
                      background: "#F8F4EC", borderRadius: 8, overflow: "hidden",
                      boxShadow: "0 4px 10px -4px rgba(52,45,39,0.2)",
                    }}>
                      <Scene />
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground text-center max-w-[96px]">
                      {cat.short}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* A4 — 20 blandede kort, gentagelses-test */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              A4 · 20 blandede kort · føles gentagelsen kurateret eller monoton?
            </div>
            <div className="rounded-2xl p-8" style={{ background: PANEL_BG }}>
              <div className="grid gap-6 justify-items-center" style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}>
                {SAMPLE_CARDS.map((s, i) => {
                  const Scene = CATEGORY_SCENES[s.category];
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div style={{ filter: "drop-shadow(0 12px 20px rgba(52,45,39,0.14))" }}>
                        <StorybookFront print={printFrom(s)} scale={0.62} sceneComponent={Scene} />
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                        {s.title} · <span className="normal-case tracking-normal">{s.category.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============ B · R1 GOLD LOGO REFINEMENT ============ */}
        <section>
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Beslutning B</div>
            <h2 className="font-serif text-2xl mt-1">R1-logo · bygget direkte på Ansigt til ansigt</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              Tre refinements af samme koncept — ikke tre nye koncepter. DNA'et fra Gold-scenen bevares
              (to profiler, mindre baby vendt mod voksen, koral punkteret responsbue). Solcirkel, horisont
              og øvrig scene er fjernet. Skal fungere ved 7 mm, på kortbagsiden, æsken og som favicon.
            </p>
          </div>

          <div className="rounded-2xl p-8" style={{ background: PANEL_BG }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {R1_VARIANTS.map((m) => {
                const active = selectedR1 === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedR1(m.id)}
                    className="rounded-xl bg-white/80 p-8 flex flex-col items-center gap-4 hover:bg-white transition text-left"
                    style={{ outline: active ? "2px solid #342D27" : "none" }}
                  >
                    <R1Mark variant={m.id} size={30} />
                    <div className="text-center">
                      <div className="font-serif text-lg">{m.name}</div>
                      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">
                        {m.description}
                      </div>
                    </div>
                    <div className="flex items-end gap-4 mt-2">
                      <R1Mark variant={m.id} size={14} />
                      <R1Mark variant={m.id} size={10} />
                      <R1Mark variant={m.id} size={7} />
                    </div>
                    {active && (
                      <div className="text-[10px] uppercase tracking-widest text-[#342D27] mt-1 inline-flex items-center gap-1">
                        <Check className="h-3 w-3" /> Valgt til produkttest
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kontekstuel test */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Æske */}
            <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Æske · forside</div>
              <div style={{
                width: 300, height: 200, background: "#F1EADB", borderRadius: 12,
                boxShadow: "0 30px 40px rgba(52,45,39,0.18), inset 0 0 0 1px rgba(52,45,39,0.06)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 14, padding: 24,
              }}>
                <R1Mark variant={selectedR1} size={22} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "22pt", color: "#342D27" }}>{WORKING_BRAND}</div>
                <div style={{ fontSize: "8pt", letterSpacing: "0.14em", textTransform: "uppercase", color: "#342D27AA" }}>
                  Aktivitetskort · det første år
                </div>
              </div>
            </div>

            {/* Website-header */}
            <div className="rounded-2xl p-8 flex flex-col items-center justify-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Website · header</div>
              <div style={{
                background: "#FFFFFF", borderRadius: 999, padding: "10px 20px",
                display: "flex", alignItems: "center", gap: 10,
                boxShadow: "0 6px 14px rgba(52,45,39,0.12)",
              }}>
                <R1Mark variant={selectedR1} size={9} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "14pt", color: "#342D27" }}>{WORKING_BRAND}</div>
              </div>
              <div className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">Favicon 7 mm</div>
              <div className="mt-2" style={{ background: "#FFFFFF", padding: 6, borderRadius: 4 }}>
                <R1Mark variant={selectedR1} size={7} />
              </div>
            </div>

            {/* Bagside preview med det valgte logo */}
            <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: PANEL_BG }}>
              <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">På bagsiden</div>
              <div style={{ filter: "drop-shadow(0 20px 30px rgba(52,45,39,0.18))" }}>
                {(() => {
                  const R = BACK_V3_RENDERERS[selectedBackV3];
                  // backs-v3 forventer RelationMarkVariant — vi viser R1 refinement som overlay
                  return (
                    <div style={{ position: "relative" }}>
                      <R scale={0.55} brandName={WORKING_BRAND} brandmark="two_profiles" />
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        pointerEvents: "none",
                      }}>
                        <div style={{ marginTop: "-14mm" }}>
                          <R1Mark variant={selectedR1} size={22 * 0.55} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground text-center max-w-[220px]">
                (Illustrativt overlay — final integration i bagsiden sker efter valg af R1.)
              </div>
            </div>
          </div>
        </section>

        {/* ============ ARKIV · design_exploration ============ */}
        <section>
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Arkiv · design_exploration (bevaret — intet slettet)
            </div>
            <h2 className="font-serif text-2xl mt-1">Tidligere retninger</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              Micro Story-scenerne, tidligere brandmarks og bagsider bevares som reference.
              Ingen nye retninger tilføjes indtil A + B er vurderet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Micro stories arkiv */}
            <div className="rounded-2xl p-6" style={{ background: PANEL_BG }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Micro stories · 12 scener (arkiveret)
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {MICRO_STORIES.map((m) => {
                  const S = MICRO_STORY_RENDERERS[m.id];
                  return (
                    <div key={m.id} className="flex flex-col items-center gap-1">
                      <div style={{
                        width: "100%", aspectRatio: "300 / 180",
                        background: "#F8F4EC", borderRadius: 8, overflow: "hidden",
                        boxShadow: "0 4px 10px -4px rgba(52,45,39,0.2)",
                      }}>
                        <S />
                      </div>
                      <div className="text-[9px] text-muted-foreground text-center">{m.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Brandmarks Round 2 (R1/R2/R3) og Round 1 */}
            <div className="rounded-2xl p-6" style={{ background: PANEL_BG }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Brandmarks · Round 2 (arkiveret)
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {RELATION_MARK_VARIANTS.map((m) => (
                  <div key={m.id} className="bg-white/70 rounded-xl p-4 flex flex-col items-center gap-2">
                    <RelationMark variant={m.id} size={14} />
                    <div className="font-serif text-xs text-center">{m.name}</div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Brandmarks · Round 1 (arkiveret)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BRANDMARK_VARIANTS.map((m) => (
                  <div key={m.id} className="bg-white/70 rounded-xl p-3 flex flex-col items-center gap-2">
                    <Brandmark variant={m.id} size={12} />
                    <div className="font-serif text-[11px] text-center">{m.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl p-6" style={{ background: PANEL_BG }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Bagsider · Round 3 (arkiveret · afventer H5)
              </div>
              <div className="grid grid-cols-2 gap-4">
                {BACK_V3_VARIANTS.map((v) => {
                  const R = BACK_V3_RENDERERS[v.id];
                  return (
                    <div key={v.id} className="flex flex-col items-center gap-2">
                      <div style={{ filter: "drop-shadow(0 8px 12px rgba(52,45,39,0.16))" }}>
                        <R scale={0.4} brandName={WORKING_BRAND} brandmark="two_profiles" />
                      </div>
                      <div className="text-[10px] text-muted-foreground text-center">{v.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl p-6" style={{ background: PANEL_BG }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                Bagsider · Round 1 &amp; 2 (arkiveret)
              </div>
              <div className="grid grid-cols-3 gap-3">
                {BACK_VARIANTS.map((v) => {
                  const R = BACK_RENDERERS[v.id];
                  return (
                    <div key={v.id} className="flex flex-col items-center gap-1">
                      <div style={{ filter: "drop-shadow(0 6px 10px rgba(52,45,39,0.14))" }}>
                        <R scale={0.32} brandName={WORKING_BRAND} showTagline={false} />
                      </div>
                      <div className="text-[9px] text-muted-foreground text-center">{v.name}</div>
                    </div>
                  );
                })}
                {BACK_ROUND2_VARIANTS.map((v) => {
                  const R = BACK_ROUND2_RENDERERS[v.id];
                  return (
                    <div key={v.id} className="flex flex-col items-center gap-1">
                      <div style={{ filter: "drop-shadow(0 6px 10px rgba(52,45,39,0.14))" }}>
                        <R scale={0.32} brandName={WORKING_BRAND} showTagline={false} />
                      </div>
                      <div className="text-[9px] text-muted-foreground text-center">{v.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-8 pb-4 max-w-2xl mx-auto">
          Stop-kriterium: I denne iteration vurderes kun A) de 10 kategoriillustrationer og
          B) R1 Gold-logo refinement. Bagside H5 og global lock håndteres separat efter A + B er godkendt.
        </footer>
      </div>
    </div>
  );
}
