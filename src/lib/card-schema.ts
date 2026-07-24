import { z } from "zod";

export const AGE_GROUPS = ["0-2m", "2-4m", "4-6m", "6-9m", "9-12m"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const AGE_LABELS: Record<AgeGroup, string> = {
  "0-2m": "0–2 måneder",
  "2-4m": "2–4 måneder",
  "4-6m": "4–6 måneder",
  "6-9m": "6–9 måneder",
  "9-12m": "9–12 måneder",
};

export const AGE_TOKEN: Record<AgeGroup, string> = {
  "0-2m": "age-1",
  "2-4m": "age-2",
  "4-6m": "age-3",
  "6-9m": "age-4",
  "9-12m": "age-5",
};

export const DEVELOPMENT_AREAS = [
  "Grovmotorik", "Finmotorik", "Balance", "Koordination", "Kropsbevidsthed",
  "Vestibulær sans", "Proprioception", "Berøring", "Syn", "Hørelse",
  "Kommunikation", "Tidligt sprog", "Følelsesmæssig regulering", "Tilknytning",
  "Sociale kompetencer", "Musik", "Natur", "Kreativitet", "Problemløsning",
  "Selvstændighed", "Hverdagsrutiner", "Søvn", "Rolig stimulering", "Aktiv leg",
] as const;

export const ACTIVITY_TYPES = [
  "Rolig leg", "Aktiv leg", "Sansestimulering", "Kontakt og nærvær",
  "Musik", "Udendørs aktivitet", "Hverdagsrutine", "Motorisk aktivitet",
  "Sprogaktivitet", "Kreativ aktivitet",
] as const;

export const DURATIONS = ["3-5 minutter", "5-10 minutter", "Fleksibel"] as const;
export const STATUSES = ["draft", "candidate", "approved", "rejected", "archived"] as const;
export type CardStatus = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<CardStatus, string> = {
  draft: "Udkast",
  candidate: "Kandidat",
  approved: "Godkendt",
  rejected: "Afvist",
  archived: "Arkiveret",
};

// ---- V4: Redaktionel review (10 dimensioner + dom) ----
export const ReviewScoreSchema = z.object({
  presence: z.number(),
  clarity: z.number(),
  warmth: z.number(),
  originality: z.number(),
  safety: z.number(),
  age_fit: z.number(),
  no_performance_pressure: z.number(),
  actionable: z.number(),
  print_fit: z.number(),
  parent_language: z.number(),
  overall: z.number(),
  notes: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});
export type ReviewScore = z.infer<typeof ReviewScoreSchema>;

export const EditorialReviewSchema = z.object({
  score: ReviewScoreSchema,
  deserves_spot: z.enum(["ja", "måske", "nej"]),
  editorial_verdict: z.string(),
  suggested_improvements: z.array(z.string()),
});
export type EditorialReview = z.infer<typeof EditorialReviewSchema>;

export const FEEDBACK_REASONS = [
  "for_generisk",
  "for_langt",
  "manglende_sikkerhed",
  "for_svært_at_følge",
  "præstationspres",
  "ikke_aldersrelevant",
  "for_likt_andet_kort",
  "sprog_for_fagligt",
  "ingen_kerneværdi",
  "andet",
] as const;
export const FEEDBACK_REASON_LABEL: Record<(typeof FEEDBACK_REASONS)[number], string> = {
  for_generisk: "For generisk",
  for_langt: "For langt",
  manglende_sikkerhed: "Manglende sikkerhed",
  for_svært_at_følge: "For svært at følge",
  præstationspres: "Præstationspres",
  ikke_aldersrelevant: "Ikke aldersrelevant",
  for_likt_andet_kort: "Ligner andet kort",
  sprog_for_fagligt: "Sprog for fagligt",
  ingen_kerneværdi: "Ingen kerneværdi",
  andet: "Andet",
};

export const ILLUSTRATION_STATUSES = ["not_generated", "draft", "approved"] as const;
export type IllustrationStatus = (typeof ILLUSTRATION_STATUSES)[number];

// ---- NYT: Print-indhold (forsiden på det fysiske kort) ----
// Alle felter påkrævet for at være OpenAI-strict-kompatibel;
// tomme strenge "" er tilladt for did_you_know / safety.
export const PrintContentSchema = z.object({
  title: z.string(),
  age_group: z.enum(AGE_GROUPS),
  intro: z.string(),
  development_areas: z.array(z.string()),
  materials: z.string(),
  steps: z.array(z.string()),
  variations: z.array(z.string()),
  look_for: z.string(),
  pause_if: z.string(),
  did_you_know: z.string(),
  safety: z.string(),
});
export type PrintContent = z.infer<typeof PrintContentSchema>;

// ---- Udvidet (digital) indhold ----
export const ExtendedContentSchema = z.object({
  purpose: z.string(),
  activity_steps: z.array(z.string()),
  variations: z.array(z.string()),
  observations: z.string(),
  pause_signs: z.string(),
  safety: z.string(),
  did_you_know: z.string(),
});
export type ExtendedContent = z.infer<typeof ExtendedContentSchema>;

// ---- AI-output: alt i ét kald ----
export const GeneratedCardSchema = z.object({
  print: PrintContentSchema,
  extended: ExtendedContentSchema,
  illustration_prompt: z.string(),
  activity_type: z.string(),
  duration: z.string(),
  primary_development_area: z.string(),
  secondary_development_areas: z.array(z.string()),
});
export type GeneratedCard = z.infer<typeof GeneratedCardSchema>;

// ---- V3: Intelligent multi-step pipeline ----
export const QualityScoreSchema = z.object({
  presence: z.number(),
  clarity: z.number(),
  warmth: z.number(),
  originality: z.number(),
  safety: z.number(),
  overall: z.number(),
  notes: z.string(),
});
export type QualityScore = z.infer<typeof QualityScoreSchema>;

export const SmartGeneratedCardSchema = z.object({
  print: PrintContentSchema,
  extended: ExtendedContentSchema,
  illustration_prompt: z.string(),
  activity_type: z.string(),
  duration: z.string(),
  primary_development_area: z.string(),
  secondary_development_areas: z.array(z.string()),
  parent_category: z.string(),
  activity_mechanics: z.array(z.string()),
  caregiver_energy: z.string(),
  setup_level: z.string(),
  good_when: z.array(z.string()),
  generation_rationale: z.string(),
  fact_statement: z.string(),
  evidence_level: z.string(),
  safety_triggers: z.array(z.string()),
});
export type SmartGeneratedCard = z.infer<typeof SmartGeneratedCardSchema>;

// Legacy (bevares for bagudkompatibilitet — bruges stadig af nogle steder)
export const CardContentSchema = z.object({
  title: z.string(),
  age_group: z.enum(AGE_GROUPS),
  purpose: z.string(),
  primary_development_area: z.string(),
  secondary_development_areas: z.array(z.string()),
  materials: z.array(z.string()),
  activity_steps: z.array(z.string()),
  variations: z.array(z.string()),
  observations: z.string(),
  pause_signs: z.string(),
  safety: z.string(),
  did_you_know: z.string(),
  activity_type: z.string(),
  duration: z.string(),
});
export type CardContent = z.infer<typeof CardContentSchema>;

export const GenerateInputSchema = z.object({
  age_group: z.enum(AGE_GROUPS),
  primary_area: z.string(),
  secondary_areas: z.array(z.string()).default([]),
  activity_type: z.string(),
  duration: z.string(),
  materials_mode: z.enum(["ai", "include", "avoid"]).default("ai"),
  materials_input: z.string().default(""),
  extra_instruction: z.string().default(""),
});
export type GenerateInput = z.infer<typeof GenerateInputSchema>;

// Simple text-based similarity (Jaccard on tokens)
function tokenize(s: string) {
  return new Set(
    s.toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}
export function jaccard(a: string, b: string) {
  const A = tokenize(a);
  const B = tokenize(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  A.forEach((x) => { if (B.has(x)) inter++; });
  return inter / (A.size + B.size - inter);
}

export function cardCorpus(c: {
  title: string; purpose?: string;
  materials?: unknown; activity_steps?: unknown;
}) {
  const arr = (v: unknown) => Array.isArray(v) ? v.join(" ") : "";
  return `${c.title} ${c.purpose ?? ""} ${arr(c.materials)} ${arr(c.activity_steps)}`;
}
