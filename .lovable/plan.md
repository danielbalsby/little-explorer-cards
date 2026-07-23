# Babyaktivitetskort MVP — Byggeplan

En intern admin-webapp til at generere, redigere, godkende og analysere 100–120 babyaktivitetskort med AI. Skandinavisk, roligt premium-design. Arkitekturen forberedes til senere SaaS-udvidelse (brugere, betaling, favoritter).

## Teknisk stak

- TanStack Start + React + TypeScript (nuværende template)
- Tailwind v4 + shadcn/ui, semantiske design tokens i `src/styles.css`
- Lovable Cloud (Supabase) til DB + auth (aktiveres først)
- Lovable AI Gateway (`openai/gpt-5.5`) til kortgenerering via `createServerFn`
- Ingen API-nøgler i frontend

## Faser (jeg bygger fase 1–3 nu, resten i opfølgende ture)

### Fase 1 — Fundament
1. Aktivér Lovable Cloud
2. Design system i `src/styles.css`: varm knækket hvid baggrund, sand, støvet grøn, afdæmpet blå, terracotta, blød gul som aldersmarkør-tokens; blød typografi (serif overskrift + sans body); afrundede hjørner; diskrete skygger
3. Sidebar-layout (shadcn sidebar) + mobilvenlig menu, routes:
   `/` (Dashboard), `/generer`, `/bibliotek`, `/balance`, `/designmanual`, `/indstillinger`
4. Simpel admin-login (email/password via Cloud auth); alle app-ruter under `_authenticated/`

### Fase 2 — Database
Migration med tabeller: `cards`, `card_versions`, `development_areas`, `design_guidelines`, `project_settings`. JSON-felter til lister (materials, activity_steps, variations). RLS: kun autentificerede admins. Seed 5–10 tydeligt markerede demo-kort (`is_demo=true`) + de 24 udviklingsområder.

### Fase 3 — Kerne-flows
- **Generér kort**: formular (aldersgruppe, primær + sekundære områder, aktivitetstype, varighed, materialer, ekstra instruktion) → server function kalder Lovable AI med struktureret output-schema matchende kortstrukturen → viser i editor
- **Korteditor**: to-kolonne layout, redigerbare felter venstre, live premium-preview højre med aldersfarvekode + områdeikoner. Handlinger: Gem udkast, Godkend, Afvis, Ny version, Duplikér, Slet, Lås
- **Originalitetskontrol**: ved gem sammenlignes titel/formål/materialer/trin mod eksisterende kort via Jaccard/token-overlap; advarsel med links til lignende kort (klar til embeddings senere)
- **Versionering**: hver ændring efter første gem skriver til `card_versions` med change_note

### Fase 4 — Overblik & eksport (opfølgende tur)
- **Dashboard**: nøgletal, statuslinje mod 120, advarsler, simple diagrammer (recharts)
- **Kortbibliotek**: grid/liste-toggle, filtre, sortering, søgning
- **Projektbalance**: fordelinger + tekstuelle anbefalinger baseret på simple regler
- **Designmanual**: CRUD på `design_guidelines`, bruges senere som AI-kontekst
- **Eksport**: CSV + JSON (alle/filtrerede/enkelt); PDF/Canva/InDesign vises som "Kommer senere"

## Denne tur leverer

Fase 1–3 komplet og funktionelt, inkl. AI-generering og editor. Fase 4 (dashboard-tal, balance-analyse, eksport) bygges i næste tur oven på samme datamodel så vi undgår at fylde denne tur med skærme før datalaget er stabilt.

## Åbne valg

1. **Login-metode i MVP**: email/password alene, eller også Google? (Google kræver `configure_social_auth`)
2. **AI-model**: OK med `openai/gpt-5.5` som default, eller foretrækker du `google/gemini-2.5-pro`?

Bekræft planen (og de to valg), så starter jeg på Fase 1.