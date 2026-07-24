
# Version 4 — Redaktionelt review-flow

Bevar alt eksisterende (data, kort, generator, print, designmanual, balance). Kun additive ændringer.

## 1. Database (én migration)

Udvid `cards`:
- `status` — udvid enum med `candidate` og `archived` (behold `draft`, `approved`, `rejected`)
- `deserves_spot text` — `yes` | `maybe` | `no`
- `editorial_verdict text` — kort samlet dom fra AI
- `editor_notes text` — internt redaktørfelt
- `print_fit_percentage numeric` — reel målt fit
- `illustration_quality jsonb` — {match, style_fit, too_generic, too_detailed, warmth}

Ny tabel `editorial_feedback`:
- `card_id`, `feedback_type` (rejection|improvement|approval), `feedback_reasons jsonb`, `feedback_note text`, `action_taken text`, `created_by`, `created_at`

Version-noter: brug eksisterende `card_versions.change_note` til AI-ændringsforklaringer (ingen skemaændring).

## 2. AI-pipeline udvidelser (`src/lib/cards.functions.ts`)

Nye server-funktioner (bevarer eksisterende):
- `reviewCard` — kører kritik + kvalitetsscore på 10 dimensioner (1-5) + editorial_verdict + deserves_spot + rationale + overlap-forklaring. Returnerer struktureret review.
- `improveCard` — tager kort + review, forbedrer kun svage dimensioner (score ≤3), returnerer nyt kort + `changes[]` (kort ændringsliste). Opretter ny card_version.
- `varyCard` — samme idé, tydeligt anderledes udførelse.
- `makeMoreEveryday` / `makeMorePresent` / `makeMoreOriginal` — targeted transforms.
- `regenerateIllustrationPrompt` udvides med toner (`simpler`|`playful`|`poetic`|`concrete`).
- `reviewIllustration` — vurderer prompt/motiv mod aktiviteten.
- `analyzeBatchOverlap` — grupperer kandidater med høj mekanik+tekst similarity.
- `submitEditorialFeedback` — gemmer i `editorial_feedback`, bruges som kontekst i næste `generateSmartCard` (rejection reasons injiceres i prompten).
- `finalApprovalCheck` — deterministisk checkliste (fit, safety-tilstede, ikke-overlap, illustration-status, længde, signaler, præstationssprog-scan).

## 3. Real print-fit måling

- Ny util `src/lib/print-fit.tsx`: renderer `CardFront` skjult (offscreen div med korrekte mm→px), måler `scrollHeight` vs container-height, returnerer procent.
- Minimum font-size respekteres — ingen auto-shrink under threshold.
- Bruges i review-panel og gemmes som `print_fit_percentage`.

## 4. Review-flow UI (`/smart` + `/generer`)

Omlæg layoutet efter generering:
- Formular kollapser til top-strip (redigerbar via "Justér input").
- Venstre/midte: stort kort-preview, forside+bagside side-by-side på desktop, toggle på mobil.
- Højre: **Redaktionelt review-panel** med:
  - Editorial verdict (én overskrift + kort dom)
  - "Fortjener en plads?" badge (ja/måske/nej)
  - 10 kvalitetsdimensioner som ★-rows
  - Print-fit måler (%)
  - Overlap-liste med similarity + forklaring
  - "Hvorfor dette kort?" (rationale, admin-only visuelt afdæmpet)
  - Editor notes textarea
- Handlingsbjælke: **Primær: "Gem som kandidat"**. Sekundær: Forbedr · Ny variation · Helt ny idé. Menu (•••): Forkort · Mere hverdagsnær · Mere nærværende · Mere original · Redigér · Afvis.

Nye dialoger:
- **Afvisningsdialog** — multi-select årsager + kommentar, gemmer feedback.
- **Sammenlign side om side** — modal med nyt kort vs valgt eksisterende kort; fremhæver overlap-felter.
- **Illustrations-review-panel** — under bagside-toggle: prompt-editor + tone-knapper + kvalitetsscore.
- **Final approval checklist** — modal ved "Godkend endeligt"; viser ✓/⚠ pr. punkt, kræver bekræftelse hvis noget mangler.

## 5. Version-diff

Kortside (`kort.$id.tsx`) får en Versioner-fane:
- Liste over `card_versions` med `change_note`
- Sammenlign to versioner (simpel diff af print-felter)

## 6. Kandidat-bibliotek

- `/bibliotek` får faner: Alle · Udkast · **Kandidater** · Godkendte · Afviste · Arkiverede
- Kandidat-fane har knap **"Gennemgå kandidater"** → ny rute `/bibliotek/review`:
  - Ét kort ad gangen, "Kandidat X af Y"
  - Handlinger: Godkend · Tilbage til udkast · Redigér · Afvis · Næste
- **Batch overlap-panel** øverst på kandidat-fanen: kalder `analyzeBatchOverlap`, viser grupper med anbefalet vinder.

## 7. Dashboard: Seriestyrke

Erstat simpel tæller med panel:
- Total + fordeling (godkendte/kandidater/udkast/afviste)
- Gennemsnitlig kvalitet
- Antal med overlap
- Antal der kræver review
- Fordelinger: materialefri %, lav-energi %, hverdag %
- Tekst: "Målsætning: 100–120 exceptionelle kort · Kvalitet prioriteres over antal"
- Pr. kategori: hvis dækning stærk → "Denne kategori er allerede stærkt dækket…"

## 8. Editor-udvidelser (`kort.$id.tsx`)

- `editor_notes` textarea
- `deserves_spot` badge (redigerbar)
- Print-fit måler live
- Illustration prompt-editor med tone-knapper
- Status-dropdown udvidet med candidate/archived

## Ikke i denne iteration
- Faktisk AI-billedgenerering (kun prompt-flow)
- ML-læring fra feedback (kun kontekst-injektion i næste generation)
- Diff på tværs af felttyper ud over simpel tekst-diff

## Implementeringsrækkefølge
1. Migration (status-enum, nye felter, feedback-tabel)
2. AI-funktioner (`reviewCard`, `improveCard`, transforms, `finalApprovalCheck`, `analyzeBatchOverlap`, `submitEditorialFeedback`)
3. Print-fit måling util
4. Review-panel + nyt layout i `/smart` (og `/generer`)
5. Afvisningsdialog + feedback-injektion i næste generation
6. Side-by-side sammenligning + illustrations-review
7. Final approval checklist
8. Kandidat-bibliotek + review-mode + batch overlap
9. Dashboard seriestyrke
10. Editor-noter + versioner-fane + version-diff

Godkend, så starter jeg med migrationen.
