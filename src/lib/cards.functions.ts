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
  status: z.enum(["draft", "approved", "rejected"]).optional(),
  change_note: z.string().optional(),
  needs_shortening: z.boolean().optional(),
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
