/**
 * Mekanik-taksonomi. Beskriver HVAD der faktisk sker i aktiviteten —
 * bruges til lighedstjek, så to forskellige overskrifter der bruger
 * samme mekanik ikke tæller som forskellige kort.
 */
export const ACTIVITY_MECHANICS = [
  // Sansning
  "visuel_sporing",
  "kontrast_kigge",
  "lyd_lokalisering",
  "berøring_stimuli",
  "spejling_ansigt",
  // Motor
  "hænder_møde_midte",
  "greb_slip",
  "række_efter_ting",
  "rulle_øve",
  "sidde_støttet",
  "kravle_øve",
  "vestibulær_gynge",
  "proprioception_tryk",
  // Kontakt & sprog
  "øjenkontakt_smil",
  "tur_taging",
  "nynne_synge",
  "benævne_pege",
  "efterligning_lyd",
  // Regulering
  "co_regulering_ro",
  "overgangs_ritual",
  "pause_signaler_læse",
  // Ude
  "natur_kigge",
  "vind_solstrejf",
  "bevægelse_barnevogn",
] as const;
export type ActivityMechanic = (typeof ACTIVITY_MECHANICS)[number];

export const MECHANIC_LABEL: Record<ActivityMechanic, string> = {
  visuel_sporing: "Visuel sporing",
  kontrast_kigge: "Kontrast-kigge",
  lyd_lokalisering: "Lyd-lokalisering",
  berøring_stimuli: "Berøringsstimuli",
  spejling_ansigt: "Ansigtsspejling",
  hænder_møde_midte: "Hænder mødes",
  greb_slip: "Greb & slip",
  række_efter_ting: "Række efter",
  rulle_øve: "Rulle-øvelse",
  sidde_støttet: "Siddestøtte",
  kravle_øve: "Kravle-øvelse",
  vestibulær_gynge: "Vestibulær vugge",
  proprioception_tryk: "Dybt tryk",
  øjenkontakt_smil: "Øjenkontakt",
  tur_taging: "Tur-tagning",
  nynne_synge: "Nynne & synge",
  benævne_pege: "Benævne & pege",
  efterligning_lyd: "Lyd-efterligning",
  co_regulering_ro: "Co-regulering",
  overgangs_ritual: "Overgangs-ritual",
  pause_signaler_læse: "Læse pause-signaler",
  natur_kigge: "Natur-kigge",
  vind_solstrejf: "Vind & solstrejf",
  bevægelse_barnevogn: "Rytme i vognen",
};

/** Jaccard-lighed på mekanik-sæt. */
export function mechanicOverlap(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  A.forEach((x) => { if (B.has(x)) inter++; });
  return inter / (A.size + B.size - inter);
}
