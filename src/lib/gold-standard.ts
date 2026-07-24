export const GOLD_STANDARD_TAGS = [
  "exceptionelt_enkelt",
  "meget_brugbart",
  "stærkt_samspil",
  "god_tekst",
  "smukt_kort",
  "høj_genbrugsværdi",
  "god_hverdagsintegration",
  "andet",
] as const;
export type GoldStandardTag = (typeof GOLD_STANDARD_TAGS)[number];

export const GOLD_STANDARD_TAG_LABEL: Record<GoldStandardTag, string> = {
  exceptionelt_enkelt: "Exceptionelt enkelt",
  meget_brugbart: "Meget brugbart",
  stærkt_samspil: "Stærkt samspil",
  god_tekst: "God tekst",
  smukt_kort: "Smukt kort",
  høj_genbrugsværdi: "Høj genbrugsværdi",
  god_hverdagsintegration: "God hverdagsintegration",
  andet: "Andet",
};

export const BLOCKING_ISSUES = [
  "safety",
  "major_overlap",
  "unclear_activity",
  "performance_pressure",
  "poor_age_fit",
  "too_complex",
  "insufficient_value",
] as const;
export type BlockingIssue = (typeof BLOCKING_ISSUES)[number];

export const BLOCKING_ISSUE_LABEL: Record<BlockingIssue, string> = {
  safety: "Sikkerhed",
  major_overlap: "Overlap",
  unclear_activity: "Uklar aktivitet",
  performance_pressure: "Præstationspres",
  poor_age_fit: "Aldersfit",
  too_complex: "For kompleks",
  insufficient_value: "Utilstrækkelig værdi",
};

export const INTRO_PATTERNS = [
  "direct_action",
  "observation",
  "everyday_context",
  "short_explanation",
  "relational",
  "sensory",
] as const;
export type IntroPattern = (typeof INTRO_PATTERNS)[number];

export const SCORE_LEGEND: Record<number, string> = {
  5: "5 · Exceptionelt — ingen oplagt forbedring",
  4: "4 · Meget godt — små forbedringer mulige",
  3: "3 · Acceptabelt — reelt problem, bør forbedres",
  2: "2 · Svagt — betydelig revision nødvendig",
  1: "1 · Bør ikke bruges",
};

export type GoldStandardEligibility = {
  ok: boolean;
  checks: Array<{ label: string; pass: boolean; detail?: string }>;
};

type ScoreLike = {
  overall?: number;
  safety?: number;
  baby_agency?: number;
  parent_learning_value?: number;
  reuse_value?: number;
  memorability?: number;
} | null | undefined;

export function evaluateGoldStandardEligibility(card: {
  quality_score?: ScoreLike;
  blocking_issues?: unknown;
  reason_to_exist?: string | null;
  print_fit_percentage?: number | null;
}): GoldStandardEligibility {
  const q = (card.quality_score ?? {}) as NonNullable<ScoreLike>;
  const blockers = Array.isArray(card.blocking_issues) ? (card.blocking_issues as string[]) : [];
  const checks = [
    { label: "Ingen blokerende problemer", pass: blockers.length === 0, detail: blockers.join(", ") || undefined },
    { label: "Sikkerhed = 5", pass: (q.safety ?? 0) >= 5 },
    { label: "Baby-agency ≥ 4", pass: (q.baby_agency ?? 0) >= 4 },
    { label: "Parent learning ≥ 4", pass: (q.parent_learning_value ?? 0) >= 4 },
    { label: "Genbrugsværdi ≥ 4", pass: (q.reuse_value ?? 0) >= 4 },
    { label: "Memorability ≥ 4", pass: (q.memorability ?? 0) >= 4 },
    { label: "Print-fit ≤ 100 %", pass: (card.print_fit_percentage ?? 100) <= 100 },
    { label: "Reason to exist er formuleret", pass: !!card.reason_to_exist && card.reason_to_exist.trim().length > 10 },
  ];
  return { ok: checks.every((c) => c.pass), checks };
}
