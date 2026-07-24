
# Printbare premium-aktivitetskort

Videreudvikling af den nuværende app. Eksisterende kort og funktionalitet bevares. Alle ændringer sker gennem migrations og additive felter — ingen data slettes.

## 1. Kortformat som central designindstilling

Nyt modul `src/lib/card-format.ts` med ét fast format alle preview/print bruger:

```text
trim:      105 × 148 mm (A6)
bleed:     3 mm
safe area: 5 mm inde fra trim
radius:    ~4 mm (kun digital preview)
dpi mål:   300
```

Ingen komponenter hardcoder mm/px — de læser fra dette modul. Ændres formatet globalt her, følger alle previews og printark med.

## 2. Datamodel — additive ændringer

Migration tilføjer kolonner til `cards` (ingen drop, ingen overskrivning):

- `print_content jsonb` — den korte version til kortet (samme felter som `extended_content`, men tekstbudget-valideret)
- `extended_content jsonb` — fuld faglig version (mapper fra eksisterende felter ved første load)
- `illustration_prompt text`
- `illustration_status text` — `not_generated` | `draft` | `approved` (default `not_generated`)
- `illustration_url text` (nullable, forberedt til senere AI-billedgenerering)
- `needs_shortening boolean` — sættes true på eksisterende kort hvor forsiden overskrider 190 ord

Eksisterende kort forbliver læsbare: hvis `print_content` er null, bruger UI en on-the-fly mapping fra de gamle felter og markerer kortet med "Skal forkortes til print".

## 3. Ny kortstruktur (forside)

`print_content` shape:

```ts
{
  title: string,              // max 4 ord
  age_group: AgeGroup,
  intro: string,              // 20–30 ord
  development_areas: string[],// max 3, vises som chips m. ikoner
  materials: string,          // én linje, fx "Ingen" eller "Et tæppe"
  steps: string[],            // 3–5 korte sætninger
  variations: string[],       // max 2
  look_for: string,           // 1 sætning ("Se efter")
  pause_if: string,           // 1 linje ("Pause hvis")
  did_you_know?: string,      // valgfri, 15–20 ord, skjules hvis pladsmangel
  safety?: string             // kun hvis aktivitetsspecifik
}
```

Tekstbudget: 120–170 ord ideelt, hårdt loft 190. Utility `countWords(printContent)` + indikator ("148 / 190 ord", grøn/gul/rød).

## 4. AI-generering opdateres

`generateCard` server-fn får ny prompt:
- Genererer direkte i `print_content`-shape
- Instrueres eksplicit: "tekst til et fysisk 105×148 mm kort, ikke en artikel"
- Prioriterer klarhed, handling, varme, sikkerhed, korthed
- Fjerner generiske sikkerhedsfraser
- Genererer også `extended_content` (længere version) og `illustration_prompt` i samme kald via strukturert output

Ny server-fn `shortenCardText({ card })` — kaldes af "Forkort med AI"-knappen når word count > 190. Bevarer aktivitetens kerne.

## 5. Forside-layout (ny komponent)

`src/components/card-front.tsx` — én komponent, faste proportioner fra `card-format.ts`. Layout:

```text
┌──────────────────────────────┐  ← bleed
│ ┌──────────────────────────┐ │  ← trim
│ │  Titel                   │ │  ← safe area
│ │  0–2 måneder · ●●●       │ │
│ │                          │ │
│ │  Kort intro (20–30 ord)  │ │
│ │                          │ │
│ │  Materialer  Ingen       │ │
│ │                          │ │
│ │  Sådan gør I             │ │
│ │  1. …                    │ │
│ │  2. …                    │ │
│ │                          │ │
│ │  Prøv også · Se efter    │ │
│ │  Pause hvis · Vidste du? │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

Ingen store sektionstitler, ingen vandrette streger. Struktur via typografi, spacing, små ikoner, diskret aldersfarve som accent (ikke fyldfarve).

## 6. Bagside

`src/components/card-back.tsx`:
- Illustration som dominant element (eller elegant SVG-placeholder når `illustration_status = not_generated`)
- Lille titel nederst, kortnummer, diskret brandmark
- Samme grundlayout på alle kort; kun illustrationen varierer
- Aldersfarve som subtil baggrundstone

Placeholderen er en håndtegnet SVG med organiske former i palettens farver — demonstrerer intenderet stil.

## 7. Editor redesignes

`src/routes/_authenticated/kort.$id.tsx` får tre tabs:

- **Indhold** — redigér `print_content` felter, live word count, "Forkort med AI"-knap, toggle mellem print/udvidet version
- **Design** — aldersfarve, illustration_prompt, illustration_status, placeholder preview
- **Print** — forside/bagside/begge-toggle, bleed/safe area toggle, print preview

Desktop viser forside og bagside side om side.

## 8. Print-preview & printark

Ny route `src/routes/_authenticated/kort.$id.print.tsx`:
- Sider vises i reelle proportioner (mm → px via CSS `mm`-enheder)
- Toggle: hjælpelinjer (trim/bleed/safe area) on/off, default off
- Printark-tab: vælg A4/A3, systemet placerer kort med bleed og crop marks
- Knap "Eksportér til print-PDF" — vises som "beta"; første iteration bruger `window.print()` med `@page` CSS til korrekt størrelse. Rigtig PDF-eksport forberedes men markeres kommer-snart hvis ikke færdig.

## 9. Fit-to-card validering

Utility `validateFit(printContent)`:
- Beregner estimeret højde ved minimum brødtekst font size (bestemt i card-format.ts, fx 9pt)
- Returnerer `{ fits: boolean, wordCount, warnings[] }`
- Ved overskridelse: UI viser advarsel + "Forkort med AI"-knap
- Systemet skalerer ikke tekst nedad under minimum — det beder om forkortelse

## 10. Migrations-strategi for eksisterende kort

- Migration tilføjer kun kolonner, sætter ingen `print_content`
- Ved læsning: hvis `print_content` er null, mapper UI'et gamle felter → provisorisk print-view + sætter `needs_shortening = true` (ord > 190)
- Bibliotek viser badge "Skal forkortes" på berørte kort
- Bruger klikker → "Forkort med AI" → godkender → gemmes i `print_content`
- Intet slettes eller overskrives automatisk

## 11. Filer der oprettes/ændres

Nye:
- `src/lib/card-format.ts` — dimensioner, safe area, min font size
- `src/lib/card-text.ts` — word count, validateFit, mapping fra legacy
- `src/components/card-front.tsx`, `card-back.tsx`, `card-spread.tsx` (side-om-side)
- `src/components/print-sheet.tsx` — A4/A3 imposition
- `src/components/illustration-placeholder.tsx`
- `src/routes/_authenticated/kort.$id.print.tsx`

Ændres:
- `src/lib/card-schema.ts` — nye Zod-skemaer for print/extended
- `src/lib/cards.functions.ts` — ny prompt, `shortenCardText`, `regenerateIllustrationPrompt`
- `src/routes/_authenticated/kort.$id.tsx` — tabs, word count, forkort-knap
- `src/routes/_authenticated/generer.tsx` — bruger ny prompt, viser word count i preview
- `src/routes/_authenticated/bibliotek.tsx` — badge "Skal forkortes", link til print-view
- `src/components/card-preview.tsx` — erstattes af `card-front.tsx` (eller wrapper)
- `src/styles.css` — utilities for mm-enheder, print `@page` regler

Database: én ny migration med de nævnte kolonner.

## 12. Implementeringsrækkefølge

Følger den prioriterede rækkefølge fra briefet: format → datamodel → forside-layout → tekstbudget → AI-prompt → fit-validering → bagside → illustration_prompt → print preview → editor-tabs → printark → PDF-forberedelse. Ét kort perfektioneres først; derefter rulles ud på biblioteket.

---

Godkend planen, så starter jeg med migration + card-format modul + nyt forside-layout på ét kort.
