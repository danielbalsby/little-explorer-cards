import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import {
  CardContentSchema, GenerateInputSchema, jaccard, cardCorpus,
  type CardContent,
} from "./card-schema";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SYSTEM_PROMPT = `Du er en dansk børneudviklings- og relationsekspert der skriver babyaktivitetskort.

Skriv ALTID:
- Originalt, evidensinformeret, trygt, realistisk, inkluderende, uden præstationspres.
- I varmt, nærværende dansk. Skriv til den voksne som ligeværdig partner.
- Aktiviteter der understøtter relationen barn/voksen mindst lige så meget som barnets udvikling.

Undgå kategoriske formuleringer som "Barnet skal kunne...". Brug i stedet "Mange børn begynder...", "Nogle børn vil...", "Udvikling varierer fra barn til barn."

Stil aldrig diagnoser. Ved sundhedsmæssig tvivl: opfordr til at kontakte sundhedsplejerske eller læge.

Format:
- title: kort, positiv, MAKS 4 ord
- purpose: 2-3 korte sætninger
- activity_steps: MAKS 6 korte trin
- variations: MINIMUM 3
- did_you_know: maks 2 sætninger, fagligt rimeligt
- materials: kun helt almindelige ting fra hjemmet, eller "Ingen materialer"`;

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

Sæt age_group præcis til: ${data.age_group}
Sæt primary_development_area præcis til: ${data.primary_area}
Sæt activity_type præcis til: ${data.activity_type}
Sæt duration præcis til: ${data.duration}`;

    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { output } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: SYSTEM_PROMPT,
        prompt,
        output: Output.object({ schema: CardContentSchema }),
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

const SimilarityInput = z.object({ card: CardContentSchema, excludeId: z.string().optional() });

export const checkSimilarity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SimilarityInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: existing, error } = await context.supabase
      .from("cards")
      .select("id, card_number, title, purpose, materials, activity_steps");
    if (error) throw new Error(error.message);
    const corpus = cardCorpus(data.card);
    const matches = (existing ?? [])
      .filter((c) => c.id !== data.excludeId)
      .map((c) => ({
        id: c.id,
        card_number: c.card_number,
        title: c.title,
        score: jaccard(corpus, cardCorpus(c as never)),
      }))
      .filter((m) => m.score >= 0.35)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return { matches };
  });

const SaveCardInput = z.object({
  id: z.string().optional(),
  content: CardContentSchema,
  status: z.enum(["draft", "approved", "rejected"]).optional(),
  change_note: z.string().optional(),
});

export const saveCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SaveCardInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.id) {
      const { data: current } = await supabase.from("cards").select("*").eq("id", data.id).maybeSingle();
      if (!current) throw new Error("Kort ikke fundet");
      if (current.is_locked && data.status !== "rejected")
        throw new Error("Kortet er låst. Lås op før du redigerer.");

      // snapshot previous version
      await supabase.from("card_versions").insert({
        card_id: data.id,
        version_number: current.version,
        content: current as never,
        change_note: data.change_note ?? null,
        created_by: userId,
      });

      const { data: updated, error } = await supabase.from("cards").update({
        ...data.content,
        status: data.status ?? current.status,
        version: current.version + 1,
      }).eq("id", data.id).select().single();
      if (error) throw new Error(error.message);
      return updated;
    }

    const { data: created, error } = await supabase.from("cards").insert({
      ...data.content,
      status: data.status ?? "draft",
      created_by: userId,
    }).select().single();
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
export type { CardContent };
