/**
 * Central designindstilling for det fysiske aktivitetskort.
 * Alle preview- og printkomponenter læser fra dette modul,
 * så formatet kan ændres globalt ét sted.
 */

export const CARD_FORMAT = {
  // Trim size (A6): 105 × 148 mm
  trim: { width: 105, height: 148 },
  // Bleed på alle sider (mm)
  bleed: 3,
  // Safe area — minimum afstand fra trim-kant til tekst (mm)
  safe: 5,
  // Digital preview-kornerradius (mm)
  cornerRadius: 4,
  // Print-DPI mål (til senere rastereksport)
  dpi: 300,
  // Minimum font size for brødtekst (pt) — under dette bør tekst forkortes
  minBodyPt: 9,
  // Målsætning for tekstlængde (ord) på forsiden
  wordBudget: { ideal: 170, hardMax: 190, warn: 175 },
} as const;

export type CardFormat = typeof CARD_FORMAT;

/** Fuld side inkl. bleed */
export function bleedSize() {
  return {
    width: CARD_FORMAT.trim.width + CARD_FORMAT.bleed * 2,
    height: CARD_FORMAT.trim.height + CARD_FORMAT.bleed * 2,
  };
}

/** Printark-formater — forberedt til imposition */
export const SHEET_FORMATS = {
  A4: { width: 210, height: 297 },
  A3: { width: 297, height: 420 },
} as const;
export type SheetFormat = keyof typeof SHEET_FORMATS;
