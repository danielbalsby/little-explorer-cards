
# Version 3 — Intelligent kortgenerator

Bevar alt eksisterende (data, printformat, forside/bagside, design). Kun additive ændringer.

## 1. Databaseudvidelser (én migration, alle felter nullable)

Tilføj til `cards`:
- `parent_category text` — forældrevenlig kategori (8 værdier)
- `activity_mechanics jsonb` — array af mekanik-slugs (visual_tracking, turn_taking, …)
- `caregiver_energy text` — very_low | low | normal | active
- `setup_level text` — none | minimal | some
- `good_when jsonb` — array af situationer
- `card_type text default 'activity'` — activity | principle
- `quality_score jsonb` — {clarity, usefulness, interaction, simplicity, age_relevance, originality, safety, no_performance_pressure, print_fit}
- `fact_statement text`, `fact_source text`, `fact_source_url text`, `fact_verified bool default false`, `fact_verified_at timestamptz`, `evidence_level text`
- `rejection_reason text`, `generation_rationale text` (intern "hvorfor dette kort")

Ny tabel `activity_safety_rules` (id, category, trigger, safety_instruction, severity, source, source_url, active, timestamps) — RLS: read auth, write admin. Seedes med ~10 basisregler (sleep, water, tummy_time, small_objects, sunlight, elevated_surface, carrying, bath, food, outdoor).

Ingen backfill for eksisterende kort — felterne står tomme til de redigeres.

## 2. Skema + konstanter (`src/lib/`)

- `parent-categories.ts` — 8 kategorier med ikoner/farvetokens
- `activity-mechanics.ts` — enum-liste + labels
- `caregiver-energy.ts`, `setup-level.ts` — enums + labels
- `card-schema.ts` — udvid `GeneratedCardSchema` med de nye felter (mechanics, parent_category, caregiver_energy, setup_level, good_when, rationale, quality_score, fact_*), samt strengere `PrintContentSchema.did_you_know` (kun hvis verificeret)

## 3. AI pipeline (`src/lib/cards.functions.ts`)

Refaktorer `generateCard` til en pipeline (samme server-fn, flere sekventielle AI-kald):

1. **Balance-analyse** — læser eksisterende kort, beregner mangler pr. aldersgruppe / parent_category / mechanic
2. **Activity Creator** — genererer aktivitetskoncept + mechanics + rationale (bruger balance-input)
3. **Critical Editor** — samme model kritiserer: præstationspres, realisme, unødvendig opsætning; kan returnere `reject: true` med begrundelse
4. **Similarity Check** — Jaccard PLUS mechanics-overlap mod eksisterende kort; returnerer top-3 lignende + overlap-score
5. **Safety Check** — matcher aktivitetens triggers mod `activity_safety_rules`, indsætter påkrævet sikkerhedstekst
6. **Card Editor** — komprimerer til `PrintContent` (≤190 ord)
7. **Print Fit** — `validateFit` (findes)
8. **Fact Gate** — `did_you_know` fjernes fra print hvis `fact_verified=false`
9. **Quality Score** — AI vurderer 1-5 på hver subkategori

Returnerer `{ generated, similar[], rationale, quality_score, rejected?, rejection_reason? }`.

Ny systemprompt bygget på §1, §2, §11, §17, §28, §29 fra briefet — inkl. VIS→VENT→SE→SVAR, forbudte fraser, foretrukne fraser, "en kort stund er nok".

Ny server-fn `shortenCardText` findes — bevares.
Ny server-fn `analyzeProjectBalance()` — returnerer mangler + næste anbefaling.

## 4. Smart Generator UI

Ny rute `src/routes/_authenticated/smart.tsx` (default fra sidebar):
- Alder
- "Hvad passer lige nu?" (chips, multi): rolig, aktiv, nærhed, udenfor, på gulvet, på puslebordet, ingen materialer, overrask mig
- Forældreenergi (4 valg)
- Ekstra ønske (fritekst)
- Viser før generering: "Smart forslag: projektet mangler …" med "Brug forslag"-knap
- Knap "Find en god aktivitet"

Efter generering: kort-preview + panel med
- **Hvorfor dette kort?** (rationale)
- **Kvalitetsscore** (visualiseret)
- **Muligt overlap** med links til lignende kort
- Knapper: Godkend · Redigér · Ny variation · Helt ny idé · Afvis (med årsag)

Eksisterende `/generer` beholdes som "Avanceret generering".

## 5. Editor + kort (`kort.$id.tsx`, `card-front.tsx`)

- Editor: nye felter (parent_category, mechanics, caregiver_energy, setup_level, good_when, fact_verified toggle + source-felter, quality_score visning)
- Kortforside: 
  - "Se efter" får lidt større vægt (typografi, ikke boks)
  - Materialer-sektion skjules helt hvis tom
  - "Vidste du?" vises kun hvis `fact_verified`
  - Sikkerhed vises kun hvis aktivitetsspecifik
- Kortbagside: viser parent_category diskret

## 6. Bibliotek + Balance + Dashboard

- **Bibliotek**: nyt filter på parent_category, caregiver_energy, setup_level; badge "Muligt overlap" hvis mechanics matcher
- **Balance**: nye paneler — parent_category, mechanics-heatmap, caregiver_energy, setup_level, hverdag vs. arrangeret, materialefrit %
- **Dashboard**: "Næste anbefalede kort" med prefilled-link til Smart Generator

## 7. Designmanual

Seed nye afsnit:
- Produktets kerne (§1)
- Samspilsprincipper: VIS→VENT→SE→SVAR (§2)
- Skriveregler: forbudte/foretrukne fraser (§29)
- No filler policy (§7)

## 8. Principle cards

Kun datamodel (`card_type='principle'`) + minimal renderer-variant (lidt afvigende layout, samme serie). Ingen auto-generering. Manuel oprettelse via editor med `card_type=principle`.

## Implementeringsrækkefølge

1. Migration (nye kolonner + safety_rules-tabel + seed rules + designmanual-seed)
2. Konstanter/skemaer i `src/lib/`
3. AI-pipeline refaktor i `cards.functions.ts` (+ `analyzeProjectBalance`)
4. Smart Generator UI + resultatpanel med reject/regenerate
5. Editor-udvidelser + kortforside/bagside-justeringer
6. Bibliotek/Balance/Dashboard-opdateringer
7. Principle card-support

## Ikke i denne iteration

- Auto-generering af principle cards (kun datamodel)
- Fuld fact-verifikations-workflow (kun felter + gate på print)
- ML-baseret rejection-læring (kun logging)

Godkend, så starter jeg med migration + skemaer.
