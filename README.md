# Little Explorer Cards

Byg en webapp til generering af babyaktivitetskort

Jeg vil bygge en moderne, brugervenlig webapp, der hjælper kommende og nuværende forældre med at generere personlige babyaktivitetskort til børn fra 0–12 måneder.

Appen skal fungere som et internt produktudviklingsværktøj i første version, men arkitekturen og designet skal være egnet til senere at kunne udvikles til et kommercielt SaaS-produkt.

Arbejd som en erfaren:

produktdesigner

UX-designer

frontendudvikler

full-stackudvikler

AI-produktudvikler

informationsarkitekt

Byg en fungerende MVP med professionelt design, tydelig navigation og en struktureret database til aktivitetskort.

Produktets formål

Brugeren skal kunne:

vælge en aldersgruppe

vælge relevante udviklingsområder

angive ønsket aktivitetstype

generere et nyt babyaktivitetskort med AI

redigere kortets indhold

gemme kortet

godkende eller afvise kortet

se alle tidligere kort i et bibliotek

filtrere og søge i kortene

opdage gentagelser og ubalance i kortsamlingen

eksportere kort til senere brug i Canva, InDesign, PDF eller tryk

Produktet skal understøtte udviklingen af et komplet sæt med 100–120 originale babyaktivitetskort.

Målgruppe

Den primære bruger i første version er produktets administrator og redaktør.

Senere skal systemet kunne udvides, så almindelige forældre kan generere personlige aktivitetskort til deres eget barn.

Design derfor systemet, så der senere kan tilføjes:

brugerprofiler

abonnement

betaling

personlige kortsamlinger

favoritter

deling

printbestilling

Disse funktioner skal ikke nødvendigvis implementeres i første MVP.

Teknisk retning

Brug den almindelige Lovable-stack.

Foretrukken opsætning:

React

TypeScript

Tailwind CSS

shadcn/ui

Supabase til database og authentication

server-side eller edge function til AI-kald

sikker opbevaring af API-nøgler

responsivt design

API-nøgler må aldrig ligge synligt i frontend-koden.

Brug modulære komponenter og en struktur, der er nem at vedligeholde og udvide.

Brugerroller

Opret i første version én rolle:

Administrator

Administratoren kan:

generere kort

redigere kort

slette kort

duplikere kort

godkende kort

markere kort som udkast

låse godkendte kort

se projektstatus

eksportere data

Forbered datamodellen til senere at kunne understøtte almindelige brugere.

Navigation

Lav en venstrestillet sidebar på desktop og en mobilvenlig menu.

Navigationen skal indeholde:

Dashboard

Generér kort

Kortbibliotek

Projektbalance

Designmanual

Indstillinger

Side 1: Dashboard

Dashboardet skal give et hurtigt overblik over projektet.

Vis følgende nøgletal:

samlet antal kort

antal godkendte kort

antal kort i udkast

antal afviste kort

antal kort pr. aldersgruppe

antal kort pr. udviklingsområde

senest redigerede kort

Tilføj en visuel statuslinje mod målet på 120 kort.

Vis også advarsler som:

for få kort i en aldersgruppe

for mange kort inden for samme udviklingsområde

gentagne materialer

mulige dubletter

manglende variation

Brug simple diagrammer og overskuelige informationskort.

Side 2: Generér kort

Lav en overskuelig formular med følgende felter:

Aldersgruppe

Vælg én:

0–2 måneder

2–4 måneder

4–6 måneder

6–9 måneder

9–12 måneder

Primært udviklingsområde

Vælg ét:

Grovmotorik

Finmotorik

Balance

Koordination

Kropsbevidsthed

Vestibulær sans

Proprioception

Berøring

Syn

Hørelse

Kommunikation

Tidligt sprog

Følelsesmæssig regulering

Tilknytning

Sociale kompetencer

Musik

Natur

Kreativitet

Problemløsning

Selvstændighed

Hverdagsrutiner

Søvn

Rolig stimulering

Aktiv leg

Sekundære udviklingsområder

Tillad valg af flere områder.

Aktivitetstype

Eksempler:

Rolig leg

Aktiv leg

Sansestimulering

Kontakt og nærvær

Musik

Udendørs aktivitet

Hverdagsrutine

Motorisk aktivitet

Sprogaktivitet

Kreativ aktivitet

Varighed

Vælg:

3–5 minutter

5–10 minutter

Fleksibel

Materialer

Brugeren kan enten:

lade AI vælge almindelige materialer

angive ønskede materialer

angive materialer, der skal undgås

Ekstra instruktion

Et frit tekstfelt til særlige ønsker.

Eksempel:

“Lav en rolig aktivitet, der kan udføres på puslebordet uden legetøj.”

Genereringsknap

Knaptekst:

“Generér aktivitetskort”

Vis en tydelig loading state, mens kortet genereres.

AI-generering

AI’en skal generere ét kort ad gangen.

Kortet skal være originalt og følge denne faste struktur:

Titel

Kort, positiv og maksimalt fire ord.

Alder

En af de fem aldersgrupper.

Formål

To til tre korte sætninger om:

hvorfor aktiviteten er god

hvilke færdigheder den understøtter

Udviklingsområder

Et primært område og relevante sekundære områder.

Materialer

Kun almindelige ting, som de fleste familier allerede har.

Aktivitet

Maksimalt seks korte trin.

Aktiviteten skal:

kunne udføres på 3–10 minutter

kunne stoppes når som helst

fungere i et almindeligt hjem

være nem at forstå

ikke kræve specialudstyr

Variationer

Minimum tre variationer.

Variationerne kan eksempelvis være:

lettere

mere udfordrende

kort version

længere version

indendørs

udendørs

Observer barnet

Beskriv ting, den voksne kan lægge mærke til.

Skriv observationer og ikke forventninger.

Tegn på pause

Beskriv relevante tegn på træthed, ubehag eller overstimulering.

Sikkerhed

Kun sikkerhedspunkter, der er relevante for den konkrete aktivitet.

Vidste du?

En kort, fagligt rimelig oplysning på højst to sætninger.

AI’ens kvalitetsprincipper

Alt genereret indhold skal være:

originalt

evidensinformeret

udviklingsstøttende

trygt

realistisk

inkluderende

enkelt

nærværsskabende

uden præstationspres

Aktiviteterne skal understøtte relationen mellem barn og voksen mindst lige så meget som barnets udvikling.

Undgå kategoriske formuleringer som:

“Barnet skal kunne…”

Brug i stedet formuleringer som:

“Mange børn begynder…”

“Nogle børn vil…”

“Udvikling varierer fra barn til barn…”

AI’en må ikke stille diagnoser, give medicinsk behandling eller erstatte rådgivning fra sundhedsprofessionelle.

Ved sundhedsmæssig tvivl skal teksten være forsigtig og opfordre brugeren til at kontakte sundhedsplejerske eller læge.

Originalitetskontrol

Før et kort gemmes, skal systemet sammenligne det med tidligere kort.

Sammenlign især:

titel

aktivitetens kerneidé

materialer

formål

udviklingsområder

trin

variationer

Vis en advarsel, hvis kortet sandsynligvis overlapper betydeligt med et tidligere kort.

Advarslen kan eksempelvis være:

“Dette kort minder muligvis om kort 017 og 042.”

Brugeren skal kunne:

se de lignende kort

generere en ny version

gemme kortet alligevel

Implementér i første version en simpel lighedskontrol baseret på tekst og metadata. Strukturér løsningen, så der senere kan tilføjes embeddings og semantisk søgning.

Korteditor

Når et kort er genereret, skal det vises i en editor med to kolonner på desktop.

Venstre kolonne:

redigerbare felter

titel

alder

formål

udviklingsområder

materialer

aktivitetstrin

variationer

observationer

tegn på pause

sikkerhed

vidste du

Højre kolonne:

live preview af det fysiske kort

Tilføj handlinger:

Gem som udkast

Godkend

Afvis

Generér ny version

Duplikér

Slet

Ved godkendelse skal kortet få status:

“Godkendt”

Godkendte kort skal kunne låses, så de ikke redigeres ved en fejl.

Kortets visuelle preview

Vis kortet som et fysisk premium-kort med:

afrundede hjørner

tydeligt informationshierarki

rolig farvekode baseret på aldersgruppe

små ikoner for udviklingsområder

god luft mellem sektioner

høj læsbarhed

tydelige overskrifter

Kortet skal stadig være en digital preview og behøver ikke være en færdig trykfil i første version.

Side 3: Kortbibliotek

Vis alle kort i et responsivt grid eller en tabel.

Brugeren skal kunne skifte mellem:

Gridvisning

Listevisning

Hvert kort skal vise:

ID

titel

alder

primært udviklingsområde

status

senest redigeret

Tilføj søgning og filtre for:

aldersgruppe

udviklingsområde

aktivitetstype

materiale

status

oprettelsesdato

Tilføj sortering efter:

senest oprettet

senest redigeret

titel

alder

status

Klik på et kort skal åbne korteditoren.

Side 4: Projektbalance

Lav en analysevisning, der hjælper med at skabe et balanceret sæt.

Vis:

antal kort pr. aldersgruppe

antal kort pr. udviklingsområde

fordeling mellem rolige og aktive aktiviteter

fordeling mellem relationelle, sanselige og motoriske aktiviteter

mest anvendte materialer

mindst anvendte områder

mulige gentagelser

Systemet skal komme med korte anbefalinger.

Eksempler:

“Der mangler aktiviteter med fokus på tidligt sprog i aldersgruppen 6–9 måneder.”

“Klud indgår i mange aktiviteter. Overvej flere aktiviteter uden materialer.”

“Der er en overvægt af aktive lege i aldersgruppen 9–12 måneder.”

Side 5: Designmanual

Lav en redigerbar side til projektets design- og tekstprincipper.

Indholdet skal blandt andet kunne omfatte:

tone of voice

tilladte og uønskede formuleringer

maksimal tekstlængde

farvekoder

ikonprincipper

illustrationstil

typografi

sikkerhedsprincipper

produktværdier

Gem designmanualen i databasen, så den senere kan bruges som kontekst ved AI-generering.

Datamodel

Opret en Supabase-database med tabeller, der mindst understøtter:

cards

Felter:

id

card_number

title

age_group

purpose

primary_development_area

secondary_development_areas

materials

activity_steps

variations

observations

pause_signs

safety

did_you_know

activity_type

duration

status

version

is_locked

similarity_score

created_at

updated_at

card_versions

Felter:

id

card_id

version_number

content

change_note

created_at

development_areas

Felter:

id

name

icon

description

design_guidelines

Felter:

id

category

title

content

updated_at

project_settings

Felter:

id

project_name

target_card_count

default_language

created_at

updated_at

Brug JSON-felter, hvor det giver mening for lister som aktivitetstrin, variationer og materialer.

Versionering

Når et kort ændres efter første lagring, skal systemet kunne gemme tidligere versioner.

Vis:

versionsnummer

dato

ændringsnote

mulighed for at se tidligere version

Implementér minimum simpel versionshistorik.

Eksport

Tilføj mulighed for at eksportere:

alle kort som CSV

alle kort som JSON

et enkelt kort som tekst

filtrerede kort som CSV

Forbered grænsefladen til senere eksport som:

PDF

Canva-data

InDesign-data

printklare filer

Vis funktioner, der endnu ikke er implementeret, som “Kommer senere” fremfor at lade dem fejle.

Visuelt design

Designet skal opleves:

skandinavisk

varmt

roligt

premium

moderne

tillidsvækkende

enkelt

Undgå et barnligt eller overpyntet udtryk.

Brug:

varme, lyse baggrunde

afdæmpede naturfarver

bløde former

diskrete skygger

god whitespace

tydelig typografi

få, velvalgte ikoner

Mulig farveretning:

varm knækket hvid

sand

støvet grøn

afdæmpet blå

varm terracotta

blød gul

Farver skal primært bruges som kategori- og aldersmarkører.

Sørg for god kontrast og tilgængelighed.

Responsivt design

Appen skal fungere på:

desktop

tablet

mobil

Korteditoren må gerne være optimeret til desktop, men alle funktioner skal stadig være anvendelige på mobil.

Demoindhold

Opret 5–10 tydeligt markerede demo-kort, så dashboard, filtre og analysevisninger kan afprøves.

Demoindholdet skal kunne slettes.

Første implementering

Start med at bygge følgende i denne rækkefølge:

appens navigation og design

Supabase-datamodel

dashboard

generatorformular

korteditor

kortbibliotek

projektbalance

designmanual

eksport

AI-integration

Brug mockdata, indtil databasen og AI-integrationen er klar.

Byg ikke kun statiske skærmbilleder. Knapper, formularer, filtre, redigering, lagring og navigation skal fungere.

Når noget kræver en ekstern API eller manglende konfiguration, skal du:

oprette den nødvendige frontend og backend-struktur

bruge en tydelig placeholder

forklare præcist, hvilken nøgle eller konfiguration der mangler

aldrig hardcode hemmelige nøgler

Succeskriterier for MVP’en

MVP’en er succesfuld, når jeg kan:

logge ind som administrator

generere eller simulere generering af ét aktivitetskort

redigere alle kortets felter

gemme kortet i databasen

godkende og låse kortet

se kortet i biblioteket

filtrere efter alder og udviklingsområde

se projektets fordeling på dashboardet

eksportere kortdata

se tidligere versioner af et kort

Prioritér funktionalitet, enkelhed og en stærk grundstruktur frem for unødvendige animationer og avancerede funktioner.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c316b1d2-d9c8-4bc3-af2b-34a9c8dbd171).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
