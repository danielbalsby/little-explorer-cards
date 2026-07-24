import { CARD_FORMAT } from "./card-format";
import type { PrintContent } from "./card-schema";
import type { AgeGroup } from "./card-schema";

/** Tæl ord i alle tekstfelter der ender på forsiden. */
export function countPrintWords(p: Partial<PrintContent>): number {
  const parts: string[] = [
    p.title ?? "",
    p.intro ?? "",
    p.materials ?? "",
    ...(p.steps ?? []),
    ...(p.variations ?? []),
    p.look_for ?? "",
    p.pause_if ?? "",
    p.did_you_know ?? "",
    p.safety ?? "",
  ];
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export type FitStatus = "ok" | "warn" | "over";

export function fitStatus(wordCount: number): FitStatus {
  const { hardMax, warn } = CARD_FORMAT.wordBudget;
  if (wordCount > hardMax) return "over";
  if (wordCount > warn) return "warn";
  return "ok";
}

/** Map et eksisterende (legacy) kort til den nye printstruktur. */
export function legacyToPrint(card: {
  title: string;
  age_group: string;
  purpose?: string | null;
  primary_development_area?: string | null;
  secondary_development_areas?: unknown;
  materials?: unknown;
  activity_steps?: unknown;
  variations?: unknown;
  observations?: string | null;
  pause_signs?: string | null;
  safety?: string | null;
  did_you_know?: string | null;
}): PrintContent {
  const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]).filter(Boolean) : []);
  const areas = [
    card.primary_development_area ?? "",
    ...arr(card.secondary_development_areas),
  ].filter(Boolean).slice(0, 3);
  const mats = arr(card.materials);
  return {
    title: card.title,
    age_group: card.age_group as AgeGroup,
    intro: (card.purpose ?? "").split(/(?<=[.!?])\s+/)[0] || (card.purpose ?? ""),
    development_areas: areas,
    materials: mats.length === 0 ? "Ingen" : mats.join(", "),
    steps: arr(card.activity_steps).slice(0, 5),
    variations: arr(card.variations).slice(0, 2),
    look_for: (card.observations ?? "").split(/(?<=[.!?])\s+/)[0] || (card.observations ?? ""),
    pause_if: (card.pause_signs ?? "").split(/(?<=[.!?])\s+/)[0] || (card.pause_signs ?? ""),
    did_you_know: card.did_you_know ?? "",
    safety: card.safety ?? "",
  };
}

/** Prøv at læse et gemt print_content jsonb, fald tilbage til legacy mapping. */
export function resolvePrintContent(card: {
  print_content?: unknown;
  title: string;
  age_group: string;
  purpose?: string | null;
  primary_development_area?: string | null;
  secondary_development_areas?: unknown;
  materials?: unknown;
  activity_steps?: unknown;
  variations?: unknown;
  observations?: string | null;
  pause_signs?: string | null;
  safety?: string | null;
  did_you_know?: string | null;
}): { print: PrintContent; isLegacy: boolean } {
  if (card.print_content && typeof card.print_content === "object") {
    return { print: card.print_content as PrintContent, isLegacy: false };
  }
  return { print: legacyToPrint(card), isLegacy: true };
}
