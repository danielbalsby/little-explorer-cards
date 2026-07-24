import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import {
  GeneratedCardSchema, GenerateInputSchema, PrintContentSchema,
  ExtendedContentSchema, CardContentSchema, jaccard, cardCorpus,
  type CardContent, type PrintContent,
} from "./card-schema";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { countPrintWords } from "./card-text";

const SYSTEM_PROMPT = `Du er en dansk børneudviklings- og relationsekspert, der skriver tekst til fysiske babyaktivitetskort.

VIGTIGT: Dette er IKKE en artikel eller vejledning. Det er tekst til et fysisk kort på 105 × 148 mm (A6). Teksten skal kunne læses hurtigt af en træt forælder.

Skriv ALTID:
- Originalt, evidensinformeret, trygt, realistisk, inkluderende, uden præstationspres.
- I varmt, nærværende dansk. Skriv til den voksne som ligeværdig partner.
- Aktiviteter der understøtter relationen mindst lige så meget som barnets udvikling.

Prioriter i denne rækkefølge: klarhed, handling, varme, sikkerhed, korthed.

Fjern aktivt: gentagelser, lange forklaringer, overflødige faglige formuleringer, generelle sikkerhedsfraser der gælder alle aktiviteter, flere eksempler med samme betydning, unødvendige udviklingsforklaringer.

Hvis en sætning kan forkortes uden at miste mening, forkort den.

Undgå: "Barnet skal kunne...". Brug: "Mange børn begynder...", "Nogle børn vil...".

Stil aldrig diagnoser. Ved sundhedsmæssig tvivl: opfordr til at kontakte sundhedsplejerske eller læge.

FORMAT — 'print' (det der printes, max 170 ord i alt):
- title: MAKS 4 ord
- intro: 20–30 ord — hvorfor er aktiviteten hyggelig/udviklingsstøttende
- development_areas: MAKS 3 områder
- materials: ÉN kort linje, fx "Ingen" eller "Et tæppe"
- steps: 3–5 korte sætninger, én handling pr. trin, ingen forklaringer i trinene
- variations: MAKS 2 korte variationer
- look_for: ÉN sætning ("Se efter"-lignende)
- pause_if: ÉN linje (pausesignaler)
- did_you_know: 15–20 ord eller "" hvis pladsmangel
- safety: 1–2 korte sætninger KUN hvis aktivitetsspecifik, ellers ""

FORMAT — 'extended' (digital, må gerne være længere):
- purpose: 2-3 sætninger
- activity_steps: op til 6 trin
- variations: 3+ variationer
- observations, pause_signs, safety, did_you_know: fyldigere

FORMAT — 'illustration_prompt':
Ét kort brief (30–60 ord) til AI-illustrator. Beskriv en minimalistisk, håndtegnet, blød, skandinavisk, varm, kønsneutral illustration relateret til aktiviteten. Nævn organiske former, støvede naturfarver, subtile teksturer. Undgå: 3D, fotorealisme, kraftige outlines, clipart, emojis, Disney-lignende figurer.`;

export const generateCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => GenerateInputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const materialsLine =
      data.materials_mode === "include"
        ? `Prøv at inkludere disse materialer: ${data.materials_input || "(ingen)"}`
        : data.materials_mode === "avoid"
          ? `UNDGÅ disse materialer: ${data.materials_input || "(ingen)"}`
          : "Vælg selv 0-2 almindelige husholdningsmaterialer, eller ingen.";

    const prompt = `Generér ét babyaktivitetskort.

Aldersgruppe: ${data.age_group}
Primært udviklingsområde: ${data.primary_area}
Sekundære udviklingsområder: ${data.secondary_areas.join(", ") || "(ingen)"}
Aktivitetstype: ${data.activity_type}
Varighed: ${data.duration}
${materialsLine}
${data.extra_instruction ? `Ekstra ønske: ${data.extra_instruction}` : ""}

Sæt print.age_group præcis til: ${data.age_group}
Sæt primary_development_area præcis til: ${data.primary_area}
Sæt activity_type præcis til: ${data.activity_type}
Sæt duration præcis til: ${data.duration}
Sæt print.development_areas til de 1-3 mest relevante fra: ${[data.primary_area, ...data.secondary_areas].join(", ")}`;

    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { output } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: SYSTEM_PROMPT,
        prompt,
        output: Output.object({ schema: GeneratedCardSchema }),
      });
      return { ok: true as const, card: output };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return { ok: false as const, error: "Kunne ikke tolke AI-svar. Prøv igen." };
      }
      const msg = error instanceof Error ? error.message : "Ukendt fejl";
      console.error("[generateCard]", msg);
      if (msg.includes("429")) return { ok: false as const, error: "AI-grænse ramt. Prøv igen om lidt." };
      if (msg.includes("402")) return { ok: false as const, error: "AI-credits opbrugt. Kontakt admin." };
      return { ok: false as const, error: msg };
    }
  });

// ---- Forkort tekst med AI ----
const ShortenInput = z.object({ print: PrintContentSchema });

export const shortenCardText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ShortenInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    const current = data.print;
    const currentJson = JSON.stringify(current, null, 2);

    try {
      const { output } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: `Du forkorter tekst til et fysisk babyaktivitetskort (105 × 148 mm).
Bevar aktivitetens kerne, tone og sikkerhed. Fjern gentagelser, overflødige forklaringer og generiske fraser.
Mål: 120–170 ord i alt, absolut max 190 ord. Bevar samme felter og samme sprog (dansk).
Regler:
- title: MAKS 4 ord
- intro: 20–30 ord
- steps: 3–5 korte sætninger
- variations: MAKS 2
- look_for / pause_if: én sætning hver
- did_you_know / safety: må gerne blive tomme "" hvis pladsmangel`,
        prompt: `Forkort dette kort. Returnér samme JSON-struktur.\n\n${currentJson}`,
        output: Output.object({ schema: PrintContentSchema }),
      });
      return { ok: true as const, print: output };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ukendt fejl";
      console.error("[shortenCardText]", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---- Regenerér illustration prompt ----
const IllustInput = z.object({ print: PrintContentSchema });

export const regenerateIllustrationPrompt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => IllustInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { text } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: `Du skriver korte illustrationsbriefs (30–60 ord) til minimalistiske, håndtegnede, bløde, skandinaviske, varme, kønsneutrale babyaktivitets-illustrationer. Nævn organiske former, støvede naturfarver, subtile teksturer. Undgå 3D, fotorealisme, kraftige outlines, clipart, emojis, Disney-lignende figurer.`,
        prompt: `Skriv ét illustrationsbrief til bagsiden af dette aktivitetskort:\n\n${JSON.stringify(data.print, null, 2)}`,
      });
      return { ok: true as const, prompt: text.trim() };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ukendt fejl";
      return { ok: false as const, error: msg };
    }
  });

// ---- Similarity ----
const SimilarityInput = z.object({
  print: PrintContentSchema.optional(),
  card: CardContentSchema.optional(),
  excludeId: z.string().optional(),
});

export const checkSimilarity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SimilarityInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: existing, error } = await context.supabase
      .from("cards")
      .select("id, card_number, title, purpose, materials, activity_steps");
    if (error) throw new Error(error.message);
    const subject = data.print
      ? `${data.print.title} ${data.print.intro} ${data.print.materials} ${data.print.steps.join(" ")}`
      : data.card ? cardCorpus(data.card) : "";
    const matches = (existing ?? [])
      .filter((c) => c.id !== data.excludeId)
      .map((c) => ({
        id: c.id,
        card_number: c.card_number,
        title: c.title,
        score: jaccard(subject, cardCorpus(c as never)),
      }))
      .filter((m) => m.score >= 0.35)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return { matches };
  });

// ---- Save (understøtter både legacy CardContent og ny print/extended) ----
const SaveCardInput = z.object({
  id: z.string().optional(),
  content: CardContentSchema.optional(),
  print: PrintContentSchema.optional(),
  extended: ExtendedContentSchema.optional(),
  illustration_prompt: z.string().optional(),
  illustration_status: z.enum(["not_generated", "draft", "approved"]).optional(),
  activity_type: z.string().optional(),
  duration: z.string().optional(),
  primary_development_area: z.string().optional(),
  secondary_development_areas: z.array(z.string()).optional(),
    status: z.enum(["draft", "candidate", "approved", "rejected", "archived"]).optional(),
    change_note: z.string().optional(),
    needs_shortening: z.boolean().optional(),
    // V3-metadata
    parent_category: z.string().optional(),
    activity_mechanics: z.array(z.string()).optional(),
    caregiver_energy: z.string().optional(),
    setup_level: z.string().optional(),
    good_when: z.array(z.string()).optional(),
    generation_rationale: z.string().optional(),
    fact_statement: z.string().optional(),
    evidence_level: z.string().optional(),
    quality_score: z.record(z.string(), z.unknown()).optional(),
    rejection_reason: z.string().optional(),
    // V4-metadata
    deserves_spot: z.enum(["ja", "måske", "nej"]).optional(),
    editorial_verdict: z.string().optional(),
    editor_notes: z.string().optional(),
    print_fit_percentage: z.number().optional(),
    illustration_quality: z.record(z.string(), z.unknown()).optional(),
    // V5-metadata
    reason_to_exist: z.string().optional(),
    activity_in_one_sentence: z.string().optional(),
    five_second_test: z.string().optional(),
    intro_pattern: z.string().optional(),
    blocking_issues: z.array(z.string()).optional(),
});

export const saveCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SaveCardInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Byg opdaterings-payload
    const payload: Record<string, unknown> = {};
    if (data.print) {
      payload.print_content = data.print;
      payload.title = data.print.title;
      payload.age_group = data.print.age_group;
      payload.needs_shortening = countPrintWords(data.print) > 190;
    }
    if (data.extended) {
      payload.extended_content = data.extended;
      payload.purpose = data.extended.purpose;
      payload.activity_steps = data.extended.activity_steps;
      payload.variations = data.extended.variations;
      payload.observations = data.extended.observations;
      payload.pause_signs = data.extended.pause_signs;
      payload.safety = data.extended.safety;
      payload.did_you_know = data.extended.did_you_know;
    }
    if (data.content) {
      Object.assign(payload, data.content);
    }
    if (data.illustration_prompt !== undefined) payload.illustration_prompt = data.illustration_prompt;
    if (data.illustration_status !== undefined) payload.illustration_status = data.illustration_status;
    if (data.activity_type !== undefined) payload.activity_type = data.activity_type;
    if (data.duration !== undefined) payload.duration = data.duration;
    if (data.primary_development_area !== undefined) payload.primary_development_area = data.primary_development_area;
    if (data.secondary_development_areas !== undefined) payload.secondary_development_areas = data.secondary_development_areas;
    if (data.needs_shortening !== undefined) payload.needs_shortening = data.needs_shortening;

    if (data.parent_category !== undefined) payload.parent_category = data.parent_category;
    if (data.activity_mechanics !== undefined) payload.activity_mechanics = data.activity_mechanics;
    if (data.caregiver_energy !== undefined) payload.caregiver_energy = data.caregiver_energy;
    if (data.setup_level !== undefined) payload.setup_level = data.setup_level;
    if (data.good_when !== undefined) payload.good_when = data.good_when;
    if (data.generation_rationale !== undefined) payload.generation_rationale = data.generation_rationale;
    if (data.fact_statement !== undefined) payload.fact_statement = data.fact_statement;
    if (data.evidence_level !== undefined) payload.evidence_level = data.evidence_level;
    if (data.quality_score !== undefined) payload.quality_score = data.quality_score;
    if (data.rejection_reason !== undefined) payload.rejection_reason = data.rejection_reason;
    if (data.deserves_spot !== undefined) payload.deserves_spot = data.deserves_spot;
    if (data.editorial_verdict !== undefined) payload.editorial_verdict = data.editorial_verdict;
    if (data.editor_notes !== undefined) payload.editor_notes = data.editor_notes;
    if (data.print_fit_percentage !== undefined) payload.print_fit_percentage = data.print_fit_percentage;
    if (data.illustration_quality !== undefined) payload.illustration_quality = data.illustration_quality;
    if (data.reason_to_exist !== undefined) payload.reason_to_exist = data.reason_to_exist;
    if (data.activity_in_one_sentence !== undefined) payload.activity_in_one_sentence = data.activity_in_one_sentence;
    if (data.five_second_test !== undefined) payload.five_second_test = data.five_second_test;
    if (data.intro_pattern !== undefined) payload.intro_pattern = data.intro_pattern;
    if (data.blocking_issues !== undefined) payload.blocking_issues = data.blocking_issues;

    // Konvertér materialer hvis print (én linje) → array til legacy-felt
    if (data.print && !data.extended && !data.content) {
      payload.materials = data.print.materials && data.print.materials.toLowerCase() !== "ingen"
        ? data.print.materials.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    }

    if (data.id) {
      const { data: current } = await supabase.from("cards").select("*").eq("id", data.id).maybeSingle();
      if (!current) throw new Error("Kort ikke fundet");
      if (current.is_locked && data.status !== "rejected")
        throw new Error("Kortet er låst. Lås op før du redigerer.");

      await supabase.from("card_versions").insert({
        card_id: data.id,
        version_number: current.version,
        content: current as never,
        change_note: data.change_note ?? null,
        created_by: userId,
      });

      const { data: updated, error } = await supabase.from("cards").update({
        ...payload,
        status: data.status ?? current.status,
        version: current.version + 1,
      }).eq("id", data.id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    }

    // Insert kræver mindst titel + age_group (kommer fra print eller content)
    if (!payload.title || !payload.age_group) {
      throw new Error("Manglende titel eller aldersgruppe");
    }
    const insertRow = {
      ...payload,
      status: data.status ?? "draft",
      created_by: userId,
    } as never;
    const { data: created, error } = await supabase.from("cards").insert(insertRow).select().single();
    if (error) throw new Error(error.message);
    return created;
  });

const IdInput = z.object({ id: z.string() });

export const deleteCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => IdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("cards").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => IdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: src, error: e1 } = await context.supabase
      .from("cards").select("*").eq("id", data.id).single();
    if (e1) throw new Error(e1.message);
    const {
      id: _id, card_number: _cn, created_at: _c, updated_at: _u, version: _v,
      is_locked: _l, is_demo: _d, ...rest
    } = src;
    void _id; void _cn; void _c; void _u; void _v; void _l; void _d;
    const { data: copy, error } = await context.supabase.from("cards").insert({
      ...rest,
      title: `${src.title} (kopi)`,
      status: "draft",
      created_by: context.userId,
    }).select().single();
    if (error) throw new Error(error.message);
    return copy;
  });

export const toggleLock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string(), locked: z.boolean() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("cards")
      .update({ is_locked: data.locked }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type SavedCard = Awaited<ReturnType<typeof saveCard>>;
export type { CardContent, PrintContent };

// ================================================================
// V3: Intelligent, forældrecentreret generator
// ================================================================

import { SmartGeneratedCardSchema, type SmartGeneratedCard } from "./card-schema";
import { mechanicOverlap } from "./activity-mechanics";

// ---- 1) Projekt-balance (ren DB-analyse, ingen AI) ----
export const analyzeProjectBalance = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: cards } = await context.supabase
      .from("cards")
      .select("age_group, primary_development_area, parent_category, caregiver_energy, activity_mechanics, status")
      .neq("status", "rejected");
    const list = cards ?? [];
    const total = list.length;

    const perAge: Record<string, number> = {};
    const perArea: Record<string, number> = {};
    const perCategory: Record<string, number> = {};
    const perEnergy: Record<string, number> = {};
    const perMechanic: Record<string, number> = {};

    for (const c of list) {
      perAge[c.age_group] = (perAge[c.age_group] ?? 0) + 1;
      if (c.primary_development_area) perArea[c.primary_development_area] = (perArea[c.primary_development_area] ?? 0) + 1;
      if (c.parent_category) perCategory[c.parent_category] = (perCategory[c.parent_category] ?? 0) + 1;
      if (c.caregiver_energy) perEnergy[c.caregiver_energy] = (perEnergy[c.caregiver_energy] ?? 0) + 1;
      for (const m of ((c.activity_mechanics ?? []) as string[])) {
        perMechanic[m] = (perMechanic[m] ?? 0) + 1;
      }
    }

    // Gaps: under-repræsenterede aldre og kategorier
    const gaps: string[] = [];
    const advice: string[] = [];
    const ages = ["0-2m", "2-4m", "4-6m", "6-9m", "9-12m"];
    for (const a of ages) {
      const n = perAge[a] ?? 0;
      if (n < 4) gaps.push(`Kun ${n} kort i ${a}`);
    }
    Object.entries(perArea).forEach(([k, n]) => {
      if (n >= 6) advice.push(`Overvægt: ${k} (${n})`);
    });
    Object.entries(perMechanic).forEach(([k, n]) => {
      if (n >= 5) advice.push(`Mekanik brugt ofte: ${k} (${n})`);
    });

    return { total, perAge, perArea, perCategory, perEnergy, perMechanic, gaps, advice };
  });

// ---- 2) Smart generator (1 AI-kald + deterministisk safety-vedhæftning) ----
const SmartGenInput = z.object({
  age_group: z.enum(["0-2m","2-4m","4-6m","6-9m","9-12m"]),
  parent_category: z.string().optional(),
  caregiver_energy: z.string().default("ok"),
  setup_level: z.string().default("ingen"),
  good_when: z.array(z.string()).default([]),
  extra_instruction: z.string().default(""),
  avoid_mechanics: z.array(z.string()).default([]),
});

const SMART_SYSTEM = `Du er en varm, evidensinformeret dansk børneudviklings-ekspert og forfatter, der skriver ét babyaktivitetskort til trætte forældre.

FILOSOFI (VIS → VENT → SE → SVAR):
Aktiviteten skal støtte NÆRVÆR frem for præstation. Ingen "tjeklister" for udvikling. Ingen jagt på milepæle.
Voksne inviteres til at VISE (tilbyde stimulus), VENTE (give barnet tid), SE (læse barnets signaler), SVARE (matche).

FORÆLDRESPROG:
Tal som en klog veninde, ikke som en fagperson. Undgå "stimulere", "øve", "træne", "udvikle motorik". Brug "kigge", "røre ved", "sige tilbage", "være sammen om".
Aldrig "barnet skal…". Brug "mange børn…", "nogle børn vil…".

INGEN FYLD:
- Fjern generiske sikkerhedsfraser der gælder ALLE aktiviteter ("hav altid barnet under opsyn").
- Fjern generelle udviklingsforklaringer ("dette styrker den motoriske udvikling").
- Fjern gentagelser og fraser der lyder pænt, men intet siger.
- Hvis en sætning ikke ændrer, hvad forælderen gør, skal den ud.

STRUKTUR:
- title: MAX 4 ord, konkret og indbydende
- intro: 20–30 ord — hvorfor er dette et lille godt øjeblik (ikke hvad barnet lærer)
- steps: 3–5 handlinger, én pr. trin, ingen forklaringer i trinene
- look_for: konkret hvad forælderen kigger efter for at læse barnets svar (fx "kigger tilbage lidt længere end sidst", "trækker foden væk")
- pause_if: konkrete pause-signaler (ikke "hvis barnet virker utilpas")
- fact_statement: kun hvis du kender EN VERIFICERBAR kilde. Sæt evidence_level = "stærk" | "moderat" | "folkelig". Hellere tom "" end fabrikeret.

MEKANIK:
Vælg 1-3 activity_mechanics fra denne liste, som beskriver HVAD der faktisk sker:
visuel_sporing, kontrast_kigge, lyd_lokalisering, berøring_stimuli, spejling_ansigt, hænder_møde_midte, greb_slip, række_efter_ting, rulle_øve, sidde_støttet, kravle_øve, vestibulær_gynge, proprioception_tryk, øjenkontakt_smil, tur_taging, nynne_synge, benævne_pege, efterligning_lyd, co_regulering_ro, overgangs_ritual, pause_signaler_læse, natur_kigge, vind_solstrejf, bevægelse_barnevogn.

FORÆLDREKATEGORI (vælg én):
Rolig kontakt | Kom-i-gang leg | Ud af huset | Puslebord & bad | Bilen & barnevognen | Puttetid & afvikling | Regnvejrsleg | Gæster & familiestunder.

CAREGIVER_ENERGY: udmattet | ok | energisk.
SETUP_LEVEL: ingen | let | moderat.
GOOD_WHEN vælg 0-3: gnavent, urolig_krop, brug_for_ro, brug_for_kontakt, brug_for_fokus, kort_tid, på_farten, hjemme_alene, sammen_med_søskende.

SAFETY_TRIGGERS: liste af triggere fra sikkerhedsreglerne der matcher aktiviteten (fx "vand", "søvn", "maveleje", "løftesituation"). Tom liste hvis ingen.

SAFETY-FELTET på selve kortet: KUN 1-2 sætninger hvis aktiviteten har SPECIFIKKE risici. Ellers "". Systemet vedhæfter formelle sikkerhedsregler.

Alt output på DANSK. Print-tekst i alt: 120-170 ord, absolut max 190.

GENERATION_RATIONALE: 1-2 sætninger til admin — hvorfor denne aktivitet passer briefen.`;

export const generateSmartCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SmartGenInput.parse(data))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    // Hent balance kort så prompten kan undgå duplikat-mekanik
    const { data: recentCards } = await context.supabase
      .from("cards")
      .select("title, activity_mechanics")
      .neq("status", "rejected")
      .limit(60);
    const overusedMechanics: Record<string, number> = {};
    for (const c of (recentCards ?? [])) {
      for (const m of ((c.activity_mechanics ?? []) as string[])) {
        overusedMechanics[m] = (overusedMechanics[m] ?? 0) + 1;
      }
    }
    const avoidHint = [
      ...data.avoid_mechanics,
      ...Object.entries(overusedMechanics).filter(([, n]) => n >= 4).map(([k]) => k),
    ];

    // Safety-regler kataloget så AI kan tagge triggers
    const { data: safetyRules } = await context.supabase
      .from("activity_safety_rules")
      .select("trigger, category")
      .eq("active", true);
    const availableTriggers = (safetyRules ?? []).map((r) => r.trigger).join(", ") || "(ingen)";

    const prompt = `Generér ét babyaktivitetskort.

Aldersgruppe: ${data.age_group}
Forældrekategori (hvis valgt): ${data.parent_category || "vælg selv"}
Caregiver energy: ${data.caregiver_energy}
Setup-niveau: ${data.setup_level}
Godt til: ${data.good_when.join(", ") || "vælg selv 0-3"}
${data.extra_instruction ? `Ekstra ønske: ${data.extra_instruction}` : ""}

UNDGÅ disse mekanikker (allerede overrepræsenterede): ${avoidHint.join(", ") || "(ingen)"}
Tilgængelige safety-triggers du kan tagge: ${availableTriggers}

Sæt print.age_group = ${data.age_group}.`;

    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { output } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: SMART_SYSTEM,
        prompt,
        output: Output.object({ schema: SmartGeneratedCardSchema }),
      });

      // Deterministisk safety-vedhæftning
      const triggered = (safetyRules ?? []).filter((r) => output.safety_triggers.includes(r.trigger));
      let attachedSafety = output.print.safety ?? "";
      // Vi tilføjer IKKE til print (pladsmangel) — vi returnerer separat, så UI kan vise
      const safetyAttachments = triggered.map((r) => ({
        trigger: r.trigger,
        category: r.category,
      }));

      // Lighedstjek på mekanik
      const { data: allCards } = await context.supabase
        .from("cards")
        .select("id, card_number, title, activity_mechanics")
        .neq("status", "rejected");
      const similarByMechanic = (allCards ?? [])
        .map((c) => ({
          id: c.id,
          card_number: c.card_number,
          title: c.title,
          mechanic_overlap: mechanicOverlap(
            output.activity_mechanics,
            (c.activity_mechanics ?? []) as string[],
          ),
        }))
        .filter((c) => c.mechanic_overlap >= 0.5)
        .sort((a, b) => b.mechanic_overlap - a.mechanic_overlap)
        .slice(0, 3);

      return {
        ok: true as const,
        card: output as SmartGeneratedCard,
        attachedSafety,
        safetyAttachments,
        similar: similarByMechanic,
      };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return { ok: false as const, error: "Kunne ikke tolke AI-svar. Prøv igen." };
      }
      const msg = error instanceof Error ? error.message : "Ukendt fejl";
      console.error("[generateSmartCard]", msg);
      if (msg.includes("429")) return { ok: false as const, error: "AI-grænse ramt. Prøv igen om lidt." };
      if (msg.includes("402")) return { ok: false as const, error: "AI-credits opbrugt." };
      return { ok: false as const, error: msg };
    }
  });

// ---- 3) Kritik-agent (Editor) — kvalitetsscore + forbedringsforslag ----
import { QualityScoreSchema } from "./card-schema";
const CritiqueInput = z.object({ print: PrintContentSchema });

export const critiqueCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => CritiqueInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { output } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: `Du er en streng redaktør. Bedøm kortet på: presence (nærvær over præstation), clarity (kan en træt forælder følge det), warmth (varm, ikke-dømmende), originality (ikke standardøvelse), safety (mangler noget). Score 1-5. Notes: konkret hvad der skal ændres. Vær ærlig — det er OK at give 2.`,
        prompt: `Bedøm dette kort:\n\n${JSON.stringify(data.print, null, 2)}`,
        output: Output.object({ schema: QualityScoreSchema }),
      });
      return { ok: true as const, score: output };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ukendt fejl";
      return { ok: false as const, error: msg };
    }
  });

// ---- 4) Afvis kort med begrundelse ----
export const rejectCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string(), reason: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("cards")
      .update({ status: "rejected", rejection_reason: data.reason })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ================================================================
// V4: Redaktionelt review-flow
// ================================================================

import { ReviewScoreSchema, EditorialReviewSchema } from "./card-schema";

// ---- Fuld redaktionel review (10 dimensioner + dom) ----
const ReviewInput = z.object({
  print: PrintContentSchema,
  parent_category: z.string().optional(),
  activity_mechanics: z.array(z.string()).default([]),
});

const REVIEW_SYSTEM = `Du er en meget streng, erfaren redaktør på et premium babyaktivitetskort-produkt.
Dit job er at afgøre om DETTE kort fortjener en plads i den endelige serie (målet er 120 kort — hvert kort skal være unikt værdifuldt).

Bedøm på 10 dimensioner, hver på skala 1-5:
1. presence: nærvær over præstation
2. clarity: kan en træt forælder følge det uden at læse to gange
3. warmth: varm, ikke-dømmende, ligeværdig tone
4. originality: ikke bare "standardøvelse"
5. safety: er alt væsentligt sikret uden overflødige fraser
6. age_fit: passer aktiviteten aldersgruppen præcist
7. no_performance_pressure: intet "barnet skal…", ingen milepæls-jagt
8. actionable: konkrete handlinger, ikke abstrakte råd
9. print_fit: passer teksten på et A6 kort (ikke for meget)
10. parent_language: forældresprog, ikke fagsprog

overall = gennemsnit (afrundet til én decimal).

Derefter DOM:
- deserves_spot: "ja" (klart værdi), "måske" (kan reddes), "nej" (drop det)
- editorial_verdict: 1-2 sætninger — din konkrete dom
- suggested_improvements: 2-4 konkrete tiltag hvis "måske"; tomme hvis "ja"; hvorfor drop hvis "nej"
- strengths: 1-3 stikord med hvad der virker
- weaknesses: 1-3 stikord med hvad der ikke virker
- notes: overordnet redaktionel note

Vær ærlig. Det er OK at afvise. Det er bedre at have 80 stærke kort end 120 middelmådige.`;

export const reviewCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ReviewInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { output } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: REVIEW_SYSTEM,
        prompt: `Bedøm dette kort.

Forældrekategori: ${data.parent_category ?? "(ikke sat)"}
Mekanik: ${data.activity_mechanics.join(", ") || "(ingen)"}
Ordantal på print: ${countPrintWords(data.print)}

${JSON.stringify(data.print, null, 2)}`,
        output: Output.object({ schema: EditorialReviewSchema }),
      });
      return { ok: true as const, review: output };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return { ok: false as const, error: "Kunne ikke tolke review-svar." };
      }
      const msg = error instanceof Error ? error.message : "Ukendt fejl";
      console.error("[reviewCard]", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---- Målrettet forbedring baseret på review-feedback ----
const ImproveInput = z.object({
  print: PrintContentSchema,
  focus: z.string(), // fx "fjern præstationspres i steps", "gør intro varmere"
  weaknesses: z.array(z.string()).default([]),
});

export const improveCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ImproveInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { output } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: `Du forbedrer et babyaktivitetskort baseret på konkret redaktionel feedback.
Bevar aktivitetens kerne, samme JSON-struktur, samme sprog (dansk).
Fjern præstationspres, generiske fraser, fagsprog. Hold 120–170 ord.
Returnér SAMME JSON-struktur — ikke forklaringer.`,
        prompt: `Forbedr dette kort.

FOKUS: ${data.focus}
Svagheder at rette: ${data.weaknesses.join(" · ") || "(ingen specifikke)"}

Nuværende kort:
${JSON.stringify(data.print, null, 2)}`,
        output: Output.object({ schema: PrintContentSchema }),
      });
      return { ok: true as const, print: output };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ukendt fejl";
      console.error("[improveCard]", msg);
      return { ok: false as const, error: msg };
    }
  });

// ---- Log redaktionel feedback (til lærings-loop) ----
const FeedbackInput = z.object({
  card_id: z.string().optional(),
  feedback_type: z.enum(["reject", "improve", "approve", "note"]),
  feedback_reasons: z.array(z.string()).default([]),
  feedback_note: z.string().optional(),
  action_taken: z.string().optional(),
});

export const submitEditorialFeedback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => FeedbackInput.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("editorial_feedback").insert({
      card_id: data.card_id ?? null,
      feedback_type: data.feedback_type,
      feedback_reasons: data.feedback_reasons,
      feedback_note: data.feedback_note ?? null,
      action_taken: data.action_taken ?? null,
      created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---- Seriestyrke: overordnet kvalitetsprofil ----
export const analyzeSeriesStrength = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: cards } = await context.supabase
      .from("cards")
      .select("status, deserves_spot, quality_score, print_fit_percentage, age_group, parent_category");
    const list = cards ?? [];
    const byStatus: Record<string, number> = {};
    const byDeserves: Record<string, number> = { ja: 0, måske: 0, nej: 0, "?": 0 };
    let scoreSum = 0, scoreN = 0;
    let fitSum = 0, fitN = 0;
    for (const c of list) {
      byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
      const d = (c.deserves_spot as string) || "?";
      byDeserves[d] = (byDeserves[d] ?? 0) + 1;
      const q = c.quality_score as { overall?: number } | null;
      if (q && typeof q.overall === "number") { scoreSum += q.overall; scoreN++; }
      if (typeof c.print_fit_percentage === "number") { fitSum += c.print_fit_percentage; fitN++; }
    }
    return {
      total: list.length,
      byStatus,
      byDeserves,
      avgQuality: scoreN > 0 ? Math.round((scoreSum / scoreN) * 10) / 10 : null,
      avgPrintFit: fitN > 0 ? Math.round(fitSum / fitN) : null,
    };
  });

