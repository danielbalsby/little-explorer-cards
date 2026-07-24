/**
 * Forældrevenlige kategorier — det sprog forældre selv bruger,
 * ikke fagligt udviklingssprog. Én kategori pr. kort.
 */
export const PARENT_CATEGORIES = [
  "Rolig kontakt",
  "Kom-i-gang leg",
  "Ud af huset",
  "Puslebord & bad",
  "Bilen & barnevognen",
  "Puttetid & afvikling",
  "Regnvejrsleg",
  "Gæster & familiestunder",
] as const;
export type ParentCategory = (typeof PARENT_CATEGORIES)[number];

export const PARENT_CATEGORY_ICON: Record<ParentCategory, string> = {
  "Rolig kontakt": "🌿",
  "Kom-i-gang leg": "✨",
  "Ud af huset": "🚶",
  "Puslebord & bad": "💧",
  "Bilen & barnevognen": "🚗",
  "Puttetid & afvikling": "🌙",
  "Regnvejrsleg": "🌧️",
  "Gæster & familiestunder": "👥",
};

export const PARENT_CATEGORY_DESCRIPTION: Record<ParentCategory, string> = {
  "Rolig kontakt": "Nærvær uden krav — for stille stunder.",
  "Kom-i-gang leg": "Aktiv leg der vækker og engagerer.",
  "Ud af huset": "Aktiviteter der virker på tur.",
  "Puslebord & bad": "Små øjeblikke i hverdagens rutiner.",
  "Bilen & barnevognen": "Når I er fastspændt sammen.",
  "Puttetid & afvikling": "Afdæmpede overgange til søvn.",
  "Regnvejrsleg": "Indendørs når vejret siger nej.",
  "Gæster & familiestunder": "Aktiviteter der inviterer andre ind.",
};
