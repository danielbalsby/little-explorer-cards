
# Version 5 — Gold Standard & redaktionel smag

Bevar alt eksisterende. Kun additive ændringer, ingen nye dashboards ud over det nødvendige.

## 1. Database (én migration)

Udvid `cards`:
- `is_gold_standard boolean default false`
- `gold_standard_reason text`
- `gold_standard_tags jsonb default '[]'` — menneskelig begrundelse (multi-select)
- `gold_standard_added_at timestamptz`, `gold_standard_removed_at timestamptz`
- `reason_to_exist text`
- `activity_in_one_sentence text`
- `five_second_test text` — `pass` | `needs_simplification`
- `intro_pattern text` — direct_action | observation | everyday_context | short_explanation | relational | sensory
- `blocking_issues jsonb default '[]'` — safety | major_overlap | unclear_activity | performance_pressure | poor_age_fit | too_complex | insufficient_value
- Udvid `quality_score` (jsonb, ingen skemaændring) med nye dimensioner: `baby_agency`, `reuse_value`, `transfer_value`, `memorability`, `parent_learning_value`, `title_quality`, `simplicity_score`, `match_quality` (ja|næsten|nej + note), `references_used` (array af card_ids).

Constraint: kun `approved` kan sættes til `is_gold_standard = true` (check trigger).

## 2. AI-lag (`src/lib/cards.functions.ts`)

Udvid, tilføj ikke helt nye pipelines:
- `reviewCard` udvides: nye dimensioner, `blocking_issues`, `reason_to_exist`, `activity_in_one_sentence`, `five_second_test`, `title_review`, `match_quality` mod udvalgte Gold Standard-kort, sprogligt gentagelses-flag.
- Ny `pickGoldStandardReferences(input)` — vælger 2–4 GS-kort (match alder+parent_category+energy, undgå samme mechanic).
- `generateSmartCard` og `improveCard` modtager referencer + injicerer systemprompt-regel: *"Gold Standard cards are quality references, not content templates…"* Returnerer `references_used`.
- Ny `detectLanguageRepetition()` — server-fn der scanner alle godkendte kort for gentagne intro/CTA-mønstre (n-grams på 3–5 ord) og returnerer top-liste + tælling. Bruges i review og som badge "bruges allerede på N kort".
- Ny `markAsGoldStandard({ id, reason, tags })` og `unmarkGoldStandard({ id })`.
- Skærpet systemprompt for review: hårdere scoring (2/3 er ok), score-definition indbygget, "reason to exist"-krav, anti-AI-tone regler, undgå falsk præcision, standard 3–4 trin, én kerneidé, responsivt "Se efter", kort "Pause hvis". Læg regelsættet i én konstant `EDITORIAL_RUBRIC` og genbrug den i alle prompter.

## 3. UI-ændringer

Kortbibliotek (`/bibliotek`):
- Ny fane: **Gold Standard** — kun `is_gold_standard = true`. Kolonner: titel, alder, parent category, primary mechanics, quality score, reason.
- Diskret ★ på kort-tiles der er GS (lille sand-farvet accent, ingen medaljer).
- Advarselsbanner hvis >15 GS eller skæv fordeling (fx >60% samme mekanik/energy).

Kortside (`kort.$id.tsx`):
- "Markér som Gold Standard" (kun synlig når `status=approved`) → dialog:
  - Bekræftelse ("kvalitetsreference, ikke skabelon")
  - Multi-select tags (Exceptionelt enkelt · Meget brugbart · Stærkt samspil · God tekst · Smukt kort · Høj genbrugsværdi · God hverdagsintegration · Andet)
  - Fri tekst `gold_standard_reason`
  - Viser GS eligibility-check (safety=5, ingen blocking, baby_agency≥4, parent_learning≥4, reuse≥4, memorability≥4, print_fit=pass, strong reason_to_exist, low overlap) — advarer men blokerer ikke
- "Fjern Gold Standard" (bevarer approved-status).
- Vis "AI vurdering" og "Redaktørens vurdering" i to adskilte kort.

Smart-generator (`/smart`) — udvid eksisterende redaktørpanel:
- Nye score-rows (baby_agency, reuse_value, transfer_value, memorability, parent_learning_value, title_quality, simplicity_score).
- Blocking issues-liste (rød pille pr. issue) — blokerer auto-GS.
- Reason to Exist (én sætning) + varsling hvis svag/tom.
- Activity-in-one-sentence + 5-second test badge.
- Match quality vs GS (ja/næsten/nej + forklaring).
- "Kvalitetsreferencer brugt" (admin-info): liste med links til de 2–4 GS-kort AI brugte.
- Sprog-gentagelses-badge på formuleringer der bruges på ≥N kort + "Omskriv mere originalt"-handling.
- Score-legende (5=Exceptionelt … 1=Bør ikke bruges) diskret nederst i panelet.

Projektbalance (`/balance`):
- Nyt afsnit **Gold Standard coverage** — tælling pr. alder og parent category. Ren info, ingen mål.

## 4. Design

- Gold Standard = lille ★ i `--color-sand` accent + tynd linje. Ingen guld, ingen badges der føles gamified.
- Score-tal med diskret farve når svag (≤2 rød-tone, 3 muted, 4–5 neutral).

## Ikke i denne iteration
- Ingen nye dashboards ud over GS-coverage-sektionen.
- Ingen automatisk GS-udpegning — kun forslag/eligibility, mennesket har sidste ord.
- Ingen ML-læring; kun prompt-injektion.

## Implementeringsrækkefølge
1. Migration (felter + trigger)
2. `EDITORIAL_RUBRIC` + skærpet `reviewCard` med nye dimensioner
3. `pickGoldStandardReferences` + injektion i `generateSmartCard`/`improveCard` + `references_used`
4. `markAsGoldStandard` / `unmarkGoldStandard` + eligibility-check
5. `detectLanguageRepetition`
6. UI: kort-side (GS-dialog, AI/redaktør adskilt)
7. UI: bibliotek (GS-fane, ★, advarsler)
8. UI: smart-panel (nye scores, blocking, reason-to-exist, referencer, sproggentagelser)
9. Balance: GS coverage-sektion

Godkend, så starter jeg med migrationen.
