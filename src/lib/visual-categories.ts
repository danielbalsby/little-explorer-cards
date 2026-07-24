/**
 * V6 — CATEGORY ILLUSTRATION SYSTEM
 *
 * Ét kort = én primær visual_category. Illustrationen er global for kategorien
 * og genbruges på tværs af alle kort i kategorien. Det er forskelligt fra
 * development_area, activity_mechanics og situation.
 */

export const VISUAL_CATEGORIES = [
  "naerhed_samspil",
  "krop_bevaegelse",
  "haender_nysgerrighed",
  "sanser_opdagelse",
  "sprog_samtale",
  "musik_rytme",
  "natur_udeliv",
  "hverdagsstunder",
  "ro_tryghed",
  "leg_udforskning",
] as const;
export type VisualCategory = (typeof VISUAL_CATEGORIES)[number];

export interface VisualCategoryMeta {
  id: VisualCategory;
  label: string;
  short: string;
  brief: string;
  /** Én af 5 basisfarver — kategoriidentiteten skal primært komme fra illustrationen, ikke farven. */
  accent: "sand" | "sage" | "mist" | "butter" | "clay";
  /** Eksempler på korttitler der falder i kategorien. */
  example_cards: string[];
}

export const VISUAL_CATEGORY_META: Record<VisualCategory, VisualCategoryMeta> = {
  naerhed_samspil: {
    id: "naerhed_samspil",
    label: "Nærhed & samspil",
    short: "Nærhed",
    brief:
      "Voksen og baby ansigt mod ansigt med et lille svar imellem. Gold Standard-scenen — bæres videre som kategoriillustration.",
    accent: "butter",
    example_cards: ["Ansigt til ansigt", "Rolig nærhed", "Smil og svar"],
  },
  krop_bevaegelse: {
    id: "krop_bevaegelse",
    label: "Krop & bevægelse",
    short: "Krop",
    brief: "Baby i bevægelse, voksens hænder tæt ved — rytme, spark, motorik.",
    accent: "butter",
    example_cards: ["Bløde spark", "Maveliggende leg", "Rul mig blidt"],
  },
  haender_nysgerrighed: {
    id: "haender_nysgerrighed",
    label: "Hænder & nysgerrighed",
    short: "Hænder",
    brief: "Baby rækker mod en enkel genstand — hånd-bevægelsen bærer scenen, ikke objektet.",
    accent: "clay",
    example_cards: ["Gribe efter genstand", "Første rangle", "Hånd i hånd"],
  },
  sanser_opdagelse: {
    id: "sanser_opdagelse",
    label: "Sanser & opdagelse",
    short: "Sanser",
    brief: "Baby møder noget sanseligt — tekstur, lys, bevægelse — med en lille responsmarkør.",
    accent: "mist",
    example_cards: ["Bladet der bevæger sig", "Blødt og hårdt", "Lysdans"],
  },
  sprog_samtale: {
    id: "sprog_samtale",
    label: "Sprog & samtale",
    short: "Sprog",
    brief: "Voksen og baby tæt på hinanden med en enkel koralfarvet talebue.",
    accent: "clay",
    example_cards: ["Ord for det vi ser", "Bog og sprog", "Første ord"],
  },
  musik_rytme: {
    id: "musik_rytme",
    label: "Musik & rytme",
    short: "Musik",
    brief: "Voksen og baby med 2–3 diskrete lyd-/rytmekurver. Ingen stor klassisk musiknote.",
    accent: "sand",
    example_cards: ["Puslebordets sang", "Sang og musik", "Klap og syng"],
  },
  natur_udeliv: {
    id: "natur_udeliv",
    label: "Natur & udeliv",
    short: "Natur",
    brief: "Voksen/baby i en enkel udendørsscene — blad, træ eller vind. Ikke et naturikon.",
    accent: "sage",
    example_cards: ["Udendørs gåtur", "Vind i træet", "Første regn"],
  },
  hverdagsstunder: {
    id: "hverdagsstunder",
    label: "Hverdagsstunder",
    short: "Hverdag",
    brief: "Enkel hverdagsscene mellem voksen og baby — påklædning, mad, overgang.",
    accent: "sand",
    example_cards: ["Skift med sang", "Bordet er dækket", "Ud af tøjet"],
  },
  ro_tryghed: {
    id: "ro_tryghed",
    label: "Ro & tryghed",
    short: "Ro",
    brief: "Baby tæt ind mod voksens skulder — inspireret af 'Rolig stund på armen'.",
    accent: "mist",
    example_cards: ["Rolig stund på armen", "Åndedrættet sammen", "Puttetid"],
  },
  leg_udforskning: {
    id: "leg_udforskning",
    label: "Leg & udforskning",
    short: "Leg",
    brief: "Baby undersøger eller påvirker en genstand, mens den voksne er til stede.",
    accent: "sage",
    example_cards: ["Tårnet der falder", "Skjul og find", "Klods på klods"],
  },
};

/** Ordered list — used for iteration in UI. */
export const VISUAL_CATEGORY_LIST: VisualCategoryMeta[] = VISUAL_CATEGORIES.map(
  (id) => VISUAL_CATEGORY_META[id],
);

/**
 * Very light hint-based fallback så vi kan foreslå kategori uden AI.
 * Bruges kun til preview i Design-lab; produktionsflowet bruger AI.
 */
export function suggestVisualCategory(text: string): VisualCategory {
  const t = text.toLowerCase();
  if (/(syng|sang|nyn|rytme|musik|tromme)/.test(t)) return "musik_rytme";
  if (/(bog|ord|sig|tal|sprog|fortæl)/.test(t)) return "sprog_samtale";
  if (/(ude|natur|blad|træ|vind|regn|klapvogn|gåtur)/.test(t)) return "natur_udeliv";
  if (/(puslebord|bad|påklæd|skift|mad|ble)/.test(t)) return "hverdagsstunder";
  if (/(sov|ro|arm|tryg|putt|åndedræt)/.test(t)) return "ro_tryghed";
  if (/(rangle|gribe|række|objekt|hånd|finger)/.test(t)) return "haender_nysgerrighed";
  if (/(spark|rul|krop|mave|løft|bevæg)/.test(t)) return "krop_bevaegelse";
  if (/(lys|tekstur|føl|smag|dufte|blødt|hårdt|sans)/.test(t)) return "sanser_opdagelse";
  if (/(byg|skjul|find|udforsk|leg|klods|tårn)/.test(t)) return "leg_udforskning";
  return "naerhed_samspil";
}
