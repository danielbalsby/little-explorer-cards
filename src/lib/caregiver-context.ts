export const CAREGIVER_ENERGY = ["udmattet", "ok", "energisk"] as const;
export type CaregiverEnergy = (typeof CAREGIVER_ENERGY)[number];
export const CAREGIVER_ENERGY_LABEL: Record<CaregiverEnergy, string> = {
  udmattet: "Udmattet",
  ok: "OK",
  energisk: "Energisk",
};

export const SETUP_LEVELS = ["ingen", "let", "moderat"] as const;
export type SetupLevel = (typeof SETUP_LEVELS)[number];
export const SETUP_LEVEL_LABEL: Record<SetupLevel, string> = {
  ingen: "Ingen forberedelse",
  let: "Let forberedelse",
  moderat: "Moderat forberedelse",
};

/** Situationer aktiviteten er særligt god til. */
export const GOOD_WHEN_TAGS = [
  "gnavent",
  "urolig_krop",
  "brug_for_ro",
  "brug_for_kontakt",
  "brug_for_fokus",
  "kort_tid",
  "på_farten",
  "hjemme_alene",
  "sammen_med_søskende",
] as const;
export type GoodWhenTag = (typeof GOOD_WHEN_TAGS)[number];

export const GOOD_WHEN_LABEL: Record<GoodWhenTag, string> = {
  gnavent: "Gnavent barn",
  urolig_krop: "Urolig krop",
  brug_for_ro: "Brug for ro",
  brug_for_kontakt: "Brug for kontakt",
  brug_for_fokus: "Brug for fokus",
  kort_tid: "Kort tid til rådighed",
  på_farten: "På farten",
  hjemme_alene: "Hjemme alene med barnet",
  sammen_med_søskende: "Med søskende omkring",
};
