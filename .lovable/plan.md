# Konstruktiv feedback på V6 — Category Illustrations + R1 Logo

Jeg har gennemgået `scenes-v2.tsx`, `category-illustrations.tsx`, `brandmarks-v6.tsx` og `design-lab.tsx`. Overordnet er retningen rigtig — 10 kategorier er det rette abstraktionsniveau, og at bygge R1 direkte af Gold-scenen er stærkt. Men der er reelle problemer som skal løses før vi låser noget.

## A. De 10 kategoriillustrationer

### Det der virker
- **Style lock holder**: `S`/`THIN` stroke-tokens er ens på tværs af alle scener → serien føles som ét sæt.
- **Genbrug af Gold-scenen** (`FaceToFace` som `naerhed_samspil`) er rigtigt strategisk — vi vinder ved ikke at genopfinde ankeret.
- **`SenseDiscovery` og `PlayExplore`** (de to nye i `category-illustrations.tsx`) matcher stilen fint. Den lille prikkede koral-respons er brugt konsistent.

### Reelle problemer (prioriteret)

**1. Kategorierne bæres af genbrugte scener — det underminerer hele V6-løftet.** Otte af ti kategorier peger direkte på en eksisterende `scenes-v2`-scene. Det betyder at `krop_bevaegelse = SoftKicks (top-down)` og `hverdagsstunder = ChangingSong (puslebord)` — men det er ikke kategori-illustrationer, det er *ét eksempel* fra kategorien. Ambitionen fra V6-briefen var at hver kategori har en signaturscene som *rummer* alle kort i den, ikke en tilfældig repræsentant. Konkret: "Skift med sang" og "Badestund" er begge `hverdagsstunder`, men scenen viser kun puslebord — badestund vil føles fejlmatchet.

**2. Kompositionel diversitet er skæv.** Fem scener er profil-mod-profil eller siddende voksen+baby (`FaceToFace`, `WordsWeSee`, `SingingMusic`, `CalmOnArm`, `PlayExplore`). Når de ligger side om side i sheet-view vil de sløre kategoriforskellen. Vi mangler top-down, tæt crop, rent objekt-fokus som tydelige signaturer.

**3. Anatomisk konsistens svinger.** Sammenlign `FaceToFace` (rolig, tegnet med sikker hånd) med `SoftKicks` babyunderkrop (path'en `M 130 82 … L 168 118 …`) som ser mere som en pære end en babykrop. `TummyPlay`-babyens hoved (`M 58 124 c -4 -8 2 -16 12 -16`) rammer heller ikke helt Gold-standarden. Ved 7 mm eller print bliver dette synligt.

**4. Farvefeltet bruges inkonsistent.** Nogle scener har fuld baggrund (`LeafMoving`, `WordsWeSee`, `BathTime`, `CalmOnArm`), andre har blot en floating cirkel/blob (`ReachingObject`, `FaceToFace`). Style lock siger "ét blødt farvefelt bagved" — vi bør vælge én model. Anbefaling: floating blob, ikke fuld rect, fordi det bevarer papirets varme.

**5. `PlayExplore` er for tæt pakket.** Baby + to klodser + voksenhånd + responsbue på ét 300×180 felt. Bryder "meget negativt rum"-reglen. Enten drop klods 2 eller drop voksenhånden.

**6. `natur_udeliv` peger på `LeafMoving`** som er en *indendørs* scene (vindueskarm + blad). Semantisk mismatch — det er "sanser" mere end "natur/udeliv". Byt `sanser_opdagelse` og `natur_udeliv` scener, eller lav en ny udendørsscene til sidstnævnte.

**7. Accentfarver i `VISUAL_CATEGORY_META` bruges ikke.** Hver kategori har en `accent` (butter/clay/mist osv.), men scenerne bruger deres egen palette. Enten fjern feltet eller bind det ind i scenens dominerende farvefelt for at give kategorien en subtil sekundær identitet.

## B. R1 Logo Refinement

### Det der virker
- Reduktionen fra Gold-scenen til to profiler + bue er rigtig. Det er den mest ærlige destillation af DNA.
- Tre varianter (baseline / open / compact) dækker beslutningsrummet uden at bløde ud.

### Problemer

**1. Baby-profilen ligner ikke en baby.** I `r1a_baseline` er højreprofilen ~30% mindre end venstre, men proportionerne (hage, pande, nakke-krumning) er en voksen i skala. Ved 7 mm favicon vil man læse "to voksne" ikke "voksen + baby". Fix: babyens pande skal være proportionalt større, hagen mindre, halsen kortere.

**2. Bue-højden i `r1b_open_response`** er næsten identisk med `r1a` (Q 55 22 vs Q 55 16) — forskellen er 6 units, hvilket forsvinder ved logo-størrelser. Enten forstørres forskellen eller drop varianten.

**3. `r1c_compact` er ikke reelt kompaktere.** Profilerne rykker 4 units tættere, men SVG'ens viewBox er stadig 0 0 100 100 — visuelt fylder mærket det samme. Skal enten cropes til tættere viewBox (fx 15 20 70 65) eller elementerne skal skaleres op inde i samme viewBox.

**4. Buen som stiplet linje er skrøbelig på print < 10 mm.** Dashes med `strokeDasharray="1 2.6"` og stroke 1.6 vil brække op ved lille reproduktion. Anbefaling: solid tynd bue som default, stiplet kun til digital.

**5. Stroke er hardcoded 2.2 på logoet vs 1.6 på scenerne.** Bevidst? Skaber en subtil ubalance når logo og kategoriillustration står ved siden af hinanden på bagsiden.

## C. Systemniveau

**1. Ingen thumbnail-test i briefen.** V6-planen nævner "20 blandede kort"-sheet men `SAMPLE_CARDS` har kun 2 pr. kategori. Vi kan ikke vurdere "føles det som kapitler i en bog" før vi ser fx 30–40 kort med samme scene → gentagelse er hele pointen at teste.

**2. Design-lab beslutningsrum mangler A/B-lock.** Der er ingen mekanisme til at markere "denne kategori er godkendt" — vi risikerer at diskutere alle 10 samtidig i det uendelige. Foreslå per-kategori accept-toggle.

**3. Ingen "kategori-mismatch"-test.** Vi bør se scenen mod dens *sværeste* kort i kategorien, ikke bare hero-titlen. "Badestund" mod puslebordsscene er den slags test der afslører hvor systemet knækker.

## Foreslåede handlinger (i prioriteret rækkefølge)

Hvis du godkender, gør jeg dette i næste build-run:

1. **Fix `naerhed_samspil` mapping-fejl** — skift `natur_udeliv` og `sanser_opdagelse` scener så semantikken holder, eller design en dedikeret udendørs-natur-scene.
2. **Redesign 3 svageste scener** til at være kategori-signaturer i stedet for enkelt-eksempler: `krop_bevaegelse`, `hverdagsstunder`, `leg_udforskning`. Målet: scener der rummer 4+ kort uden mismatch.
3. **Style-lock cleanup**: floating blob-baggrund overalt (ingen fuld-rect fill), stroke 1.6/opacity 0.72 konsistent, accentfarve fra `VISUAL_CATEGORY_META` bindes ind som subtilt farvefelt.
4. **R1 baby-proportioner**: gør baby til reelt baby (større pande, kortere hals, mindre hage). Buen: solid som default, stiplet variant separat. Compact: crop viewBox i stedet for at rykke elementer.
5. **Udvid `SAMPLE_CARDS` til 3–4 pr. kategori** (30–40 kort total) i Design-lab, og tilføj per-kategori "Godkendt"-toggle med persistering i localStorage.
6. **Ingen DB/generator-ændringer** — vi låser stadig kun visuelt, som V6-briefen kræver.

### Teknisk

- Alle ændringer sker i `src/components/card-variants/scenes-v2.tsx`, `category-illustrations.tsx`, `brandmarks-v6.tsx`, `design-lab.tsx`, `lib/visual-categories.ts`.
- Ingen migrationer, ingen serverfn-ændringer.
- Bevar `MICRO_STORY_RENDERERS` og eksisterende scener uændret hvor de også bruges — kun de scener kategorierne peger på skal potentielt duplikeres til kategori-specifikke varianter.
